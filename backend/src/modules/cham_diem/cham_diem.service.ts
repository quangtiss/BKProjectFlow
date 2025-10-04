import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChamDiemService {
    constructor(private readonly prismaService: PrismaService) { }

    async getCurrentAndNextHocKy() {
        const hocKyList = await this.prismaService.hoc_ky.findMany()
        if (!hocKyList) throw new NotFoundException('Không tìm thấy dữ liệu học kỳ của hệ thống')
        const sorted = [...hocKyList]
            .filter(hk => hk.ngay_bat_dau)
            .sort(
                (a, b) => new Date(a.ngay_bat_dau!).getTime() - new Date(b.ngay_bat_dau!).getTime()
            );

        const now = new Date();

        let current;
        let next;

        for (let i = 0; i < sorted.length; i++) {
            const start = new Date(sorted[i].ngay_bat_dau!);

            // Nếu now >= start thì đây có thể là current
            if (now >= start) {
                current = sorted[i];
                // Kiểm tra học kỳ kế tiếp
                if (i + 1 < sorted.length && now < new Date(sorted[i + 1].ngay_bat_dau!)) {
                    next = sorted[i + 1];
                    break;
                }
            }

            // Nếu now < start thì học kỳ này chính là tiếp theo
            if (now < start) {
                next = sorted[i];
                break;
            }
        }

        return { current, next };
    }


    async create(data: any, idGV: number) {
        return await this.prismaService.$transaction(async (tx) => {
            for (const sv of data.danh_gia) {
                const records = sv.diem.map((diem) => ({
                    id_giang_vien: idGV,
                    id_sinh_vien: sv.id_sinh_vien,
                    id_tieu_chi: diem.id_tieu_chi,
                    id_de_tai: data.id_de_tai,
                    ket_qua_cham: String(diem.diem),
                }))
                await tx.cham_diem.createMany({ data: records })
            }
            return { message: 'Thành công' }
        })
    }


    async updateAll(data: any) {
        return await this.prismaService.$transaction(async (tx) => {
            const deTai = await tx.de_tai.findUnique({ where: { id: data.id_de_tai } })
            if (!deTai) throw new NotFoundException('Không tìm thấy đề tài')
            const allDiem = await tx.cham_diem.findMany({
                where: {
                    id_de_tai: data.id_de_tai,
                    tieu_chi: {
                        nhom_tieu_chi: {
                            mau_danh_gia: {
                                giai_doan: deTai.giai_doan
                            }
                        }
                    }
                }
            })
            // 1. Đếm số giảng viên
            const soGVHuongDanPhanBien = deTai.giai_doan === 'Đồ án chuyên ngành' ? 0 : 2;
            const gVHoiDong = await tx.hoi_dong.findUnique({
                where: {
                    id: data.id_hoi_dong,
                },
                include: {
                    tham_gia: true
                }
            })
            const soGVHoiDong = gVHoiDong?.tham_gia.length || 0
            const soGiangVien = soGVHoiDong + soGVHuongDanPhanBien

            // 2. Cộng điểm theo sinh viên
            const tongTheoSinhVien: Record<number, number> = {}
            for (const diem of allDiem) {
                if (!tongTheoSinhVien[diem.id_sinh_vien!]) {
                    tongTheoSinhVien[diem.id_sinh_vien!] = 0
                }
                if (!isNaN(Number(diem.ket_qua_cham))) tongTheoSinhVien[diem.id_sinh_vien!] += Number(diem.ket_qua_cham)! // giả sử field tên là ket_qua_cham
            }

            // 3. Tính trung bình theo sinh viên
            const trungBinhTheoSinhVien = Object.entries(tongTheoSinhVien).map(
                ([id_sinh_vien, tong]) => ({
                    id_sinh_vien: Number(id_sinh_vien),
                    diem_chuyen_nganh: Math.round(tong / soGiangVien),
                    id_de_tai: deTai.id
                })
            )

            //4. Cập nhật kết quả
            if (deTai.giai_doan === 'Đồ án chuyên ngành') await tx.ket_qua.createMany({ data: trungBinhTheoSinhVien })
            else {
                for (const diem of trungBinhTheoSinhVien) {
                    await tx.ket_qua.update({
                        where: {
                            id_sinh_vien: diem.id_sinh_vien,
                            id_de_tai: diem.id_de_tai
                        },
                        data: {
                            diem_tot_nghiep: diem.diem_chuyen_nganh
                        }
                    })
                }
            }

            //5. Cập nhật trạng thái mới cho đề tài
            const hocKy = await this.getCurrentAndNextHocKy()
            await tx.thuoc_ve.updateMany({
                where: {
                    id_de_tai: deTai.id,
                    trang_thai: 'Đang làm'
                },
                data: {
                    trang_thai: 'Hoàn thành'
                }
            })

            if (deTai.giai_doan === 'Đồ án chuyên ngành') {
                await tx.de_tai.update({
                    where: { id: deTai.id },
                    data: {
                        giai_doan: 'Đồ án tốt nghiệp'
                    }
                })

                await tx.thuoc_ve.create({
                    data: {
                        id_de_tai: deTai.id,
                        id_hoc_ky: hocKy.next.id,
                        trang_thai: 'Đang làm'
                    }
                })
            } else {
                await tx.de_tai.update({
                    where: { id: deTai.id },
                    data: {
                        giai_doan: 'Hoàn thành'
                    }
                })
            }


            //6.Cập nhật trạng thái chấm
            await tx.phan_bien.updateMany({
                where: {
                    id_de_tai: deTai.id,
                    trang_thai: 'Chưa chấm'
                },
                data: {
                    trang_thai: 'Đã chấm'
                }
            })

            await tx.danh_gia.updateMany({
                where: {
                    id_de_tai: deTai.id,
                    trang_thai: 'Chưa chấm'
                },
                data: {
                    trang_thai: 'Đã chấm'
                }
            })


            return { message: 'Thành công' }
        })
    }
}
