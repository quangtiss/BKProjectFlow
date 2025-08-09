import { DuyetDeTaiService } from './../duyet_de_tai/duyet_de_tai.service';
import { SinhVienService } from './../sinh_vien/sinh_vien.service';
import { GiangVienService } from './../giang_vien/giang_vien.service';
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DangKiService } from '../dang_ky/dang_ky.service';
import { HuongDanService } from '../huong_dan/huong_dan.service';
import { Prisma } from '@prisma/client';
import { ThongBaoService } from '../thong_bao/thong_bao.service';
import { TuongTacService } from '../tuong_tac/tuong_tac.service';

@Injectable()
export class DeTaiService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly dangKiService: DangKiService,
        private readonly duyetDeTaiService: DuyetDeTaiService,
        private readonly sinhVienService: SinhVienService,
        private readonly giangVienService: GiangVienService,
        private readonly huongDanService: HuongDanService,
        private readonly thongBaoService: ThongBaoService,
        private readonly tuongTacService: TuongTacService
    ) { }

    async findAll(query) {
        return await this.prismaService.de_tai.findMany({
            where: query,
            include: {
                tai_khoan: {
                    include: {
                        sinh_vien: true,
                        giang_vien: true,
                    }
                },
                huong_dan: {
                    include: {
                        giang_vien: {
                            include: {
                                tai_khoan: true
                            }
                        }
                    }
                },
                dang_ky: {
                    where: {
                        trang_thai: "Đã chấp nhận"
                    },
                    include: {
                        sinh_vien: {
                            include: {
                                tai_khoan: true
                            }
                        }
                    }
                },
                duyet_de_tai: {
                    include: {
                        giang_vien_truong_bo_mon: {
                            include: {
                                tai_khoan: true
                            }
                        }
                    }
                }
            }
        });
    }


    async findById(id: number, tx?: Prisma.TransactionClient) {
        const client = tx ?? this.prismaService;
        return await client.de_tai.findUnique({
            where: { id },
        });

    }


    async create(data: any, user: any) {
        const { id_giang_vien_huong_dan, list_id_sinh_vien_tham_gia, ...dataDeTai } = data
        if (list_id_sinh_vien_tham_gia.length > data.so_luong_sinh_vien)
            throw new BadRequestException("Số lượng sinh viên tham gia không khớp với số lượng yêu cầu")
        const prefix =
            dataDeTai.nhom_nganh === "Khoa học Máy tính"
                ? "KH"
                : dataDeTai.nhom_nganh === "Kỹ thuật Máy tính"
                    ? "KT"
                    : "LN";


        return await this.prismaService.$transaction(async (tx) => {
            const isDuyet = user.role === 'Giảng viên trưởng bộ môn' && user.sub === id_giang_vien_huong_dan;

            const listSinhVienThamGia = await Promise.all(
                list_id_sinh_vien_tham_gia.map((idSinhVien: number) => this.sinhVienService.findById(idSinhVien))
            )
            const groups = new Set(
                listSinhVienThamGia.map((sv) => {
                    if (dataDeTai.nhom_nganh !== 'Liên ngành CS-CE' && sv.nganh !== dataDeTai.nhom_nganh)
                        throw new ConflictException("Danh sách sinh viên không phù hợp với nhóm ngành đã đăng ký")
                    if (sv.he_dao_tao === 'Chất lượng cao tăng cường tiếng Nhật') return 'CN';
                    if (sv.he_dao_tao === 'Chất lượng cao') return 'CC';
                    return 'OTHER';
                })
            );
            if (
                dataDeTai.he_dao_tao === "Tiếng Việt" && groups.has("CC") ||
                dataDeTai.he_dao_tao === "Tiếng Anh" && (groups.has("CN") || groups.has("OTHER"))
            ) throw new ConflictException("Danh sách sinh viên không phù hợp với hệ đào tạo đã đăng ký")

            if (groups.size > 1) {
                throw new ConflictException('Chỉ được làm chung đề tài nếu cùng nhóm được khoa quy định');
            }

            const deTai = await tx.de_tai.create({
                data: {
                    ...dataDeTai,
                    ma_de_tai: null,
                    ngay_tao: new Date(),
                    trang_thai: user.sub === id_giang_vien_huong_dan ? "GVHD đã chấp nhận" : "GVHD chưa chấp nhận",
                    trang_thai_duyet: "Chưa duyệt",
                    giai_doan: "Đồ án chuyên ngành",
                    id_tai_khoan_de_xuat: user.sub,
                    so_sinh_vien_dang_ky: list_id_sinh_vien_tham_gia.includes(user.sub) ? 1 : 0,
                }
            })
            const maDeTai = `${prefix}${deTai.id.toString().padStart(4, "0")}`;
            const deTaiUpdated = await this.update(deTai.id, { ma_de_tai: maDeTai }, tx)


            if (isDuyet) {
                await this.duyetDeTaiService.create({
                    id_de_tai: deTaiUpdated?.id,
                    trang_thai: "Đã chấp nhận"
                }, user.sub, tx)
            }


            await this.huongDanService.create({
                vai_tro: "Giảng viên hướng dẫn chính",
                id_giang_vien: id_giang_vien_huong_dan,
                id_de_tai: deTai.id,
                trang_thai: user.sub === id_giang_vien_huong_dan ? "Đã chấp nhận" : "Chưa chấp nhận",
            }, tx)


            await Promise.all(
                list_id_sinh_vien_tham_gia.map((idSinhVien: number) =>
                    this.dangKiService.create({
                        trang_thai: user.sub === idSinhVien ? "Đã chấp nhận" : "Chưa chấp nhận",
                        id_sinh_vien: idSinhVien,
                        id_de_tai: deTai.id
                    }, tx)
                )
            )

            return deTaiUpdated
        });
    }

    async update(id: number, data: any, tx?: Prisma.TransactionClient) {
        const client = tx ?? this.prismaService;
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await client.de_tai.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.de_tai.delete({
            where: { id }
        })
    }
}
