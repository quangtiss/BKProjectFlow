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


    async findAll(query) {
        return await this.prismaService.cham_diem.findMany({
            where: {
                id_de_tai: +query.idDeTai,
                id_hoc_ky: +query.idHocKy,
                vai_tro: query.vaiTro,
                giai_doan: query.giaiDoan
            },
            include: {
                giang_vien: {
                    include: {
                        tai_khoan: true
                    }
                },
                bang_diem: {
                    include: {
                        sinh_vien: {
                            include: {
                                tai_khoan: true
                            }
                        },
                        diem_thanh_phan: true
                    }
                }
            }
        })
    }

    async create(data: any, idGV: number) {
        return await this.prismaService.$transaction(async (tx) => {
            await tx.diem_thanh_phan.deleteMany({
                where: {
                    bang_diem: {
                        cham_diem: {
                            id_giang_vien: idGV,
                            giai_doan: data.giai_doan,
                            vai_tro: data.vai_tro,
                            id_de_tai: data.id_de_tai,
                            id_hoc_ky: data.id_hoc_ky
                        }
                    }
                }
            })

            await tx.bang_diem.deleteMany({
                where: {
                    cham_diem: {
                        id_giang_vien: idGV,
                        giai_doan: data.giai_doan,
                        vai_tro: data.vai_tro,
                        id_de_tai: data.id_de_tai,
                        id_hoc_ky: data.id_hoc_ky
                    }
                }
            })

            await tx.cham_diem.deleteMany({
                where: {
                    id_giang_vien: idGV,
                    giai_doan: data.giai_doan,
                    vai_tro: data.vai_tro,
                    id_de_tai: data.id_de_tai,
                    id_hoc_ky: data.id_hoc_ky
                }
            })

            const chamDiem = await tx.cham_diem.create({
                data: {
                    id_giang_vien: idGV,
                    giai_doan: data.giai_doan,
                    vai_tro: data.vai_tro,
                    id_de_tai: data.id_de_tai,
                    id_hoc_ky: data.id_hoc_ky
                }
            })

            for (const sv of data.danh_gia) {
                const bangDiem = await tx.bang_diem.create({
                    data: {
                        id_sinh_vien: sv.id_sinh_vien,
                        id_cham_diem: chamDiem.id
                    }
                })
                const records = sv.diem.map((diem) => ({
                    id_bang_diem: bangDiem.id,
                    id_tieu_chi: diem.id_tieu_chi,
                    diem: String(diem.diem),
                }))
                await tx.diem_thanh_phan.createMany({ data: records })
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
                    giai_doan: deTai.giai_doan,
                    id_hoc_ky: data.id_hoc_ky
                },
                include: {
                    bang_diem: {
                        include: {
                            diem_thanh_phan: true
                        }
                    }
                }
            })
            const soLuong = allDiem.length
            // 2. Cộng điểm theo sinh viên
            const tongDiemTheoSinhVien = {}
            for (const chamDiem of allDiem) {
                // Duyệt từng bảng điểm của giảng viên đó
                for (const bangDiem of chamDiem.bang_diem) {
                    const idSV = bangDiem.id_sinh_vien

                    // Nếu sinh viên này chưa có trong object thì khởi tạo
                    if (!tongDiemTheoSinhVien[idSV!]) {
                        tongDiemTheoSinhVien[idSV!] = 0
                    }

                    // Duyệt tất cả điểm thành phần
                    for (const diemTP of bangDiem.diem_thanh_phan) {
                        const diemSo = parseFloat(diemTP.diem!)

                        // Chỉ cộng nếu là số hợp lệ (bỏ qua "E" hoặc ký tự khác)
                        if (!isNaN(diemSo)) {
                            tongDiemTheoSinhVien[idSV!] += diemSo
                        }
                    }
                }
            }
            // Sau khi có tổng điểm => chia cho countAll
            for (const idSV in tongDiemTheoSinhVien) {
                tongDiemTheoSinhVien[idSV] = Math.round(tongDiemTheoSinhVien[idSV] / soLuong)
            }
            const dods = Object.entries(tongDiemTheoSinhVien).map(([id_sinh_vien, diem]) => ({
                id_de_tai: deTai.id,
                id_sinh_vien: Number(id_sinh_vien),
                diem_chuyen_nganh: Number(diem),
            }))

            //4. Cập nhật kết quả
            if (deTai.giai_doan === 'Đồ án chuyên ngành')
                await tx.ket_qua.createMany({
                    data: dods
                })
            else {
                for (const diem of dods) {
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


            // return { message: 'Thành công' }
        })
    }
}
