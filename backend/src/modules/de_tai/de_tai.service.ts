import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DangKiService } from '../dang_ky/dang_ky.service';
import { HuongDanService } from '../huong_dan/huong_dan.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DeTaiService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly dangKiService: DangKiService,
        private readonly huongDanService: HuongDanService
    ) { }

    async findAll(query) {
        return await this.prismaService.de_tai.findMany({
            where: query,
            include: {
                tai_khoan: {
                    include: {
                        sinh_vien: true,
                        giang_vien: true,
                        giao_vu: true,
                        giang_vien_truong_bo_mon: true
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
                }
            }
        });
    }


    async findById(id: number) {
        return await this.prismaService.de_tai.findUnique({
            where: { id },
        });

    }


    async create(data: any, user: any) {
        const { id_giang_vien_huong_dan, list_id_sinh_vien_tham_gia, ...dataDeTai } = data
        const prefix =
            dataDeTai.nhom_nganh === "Khoa học Máy tính"
                ? "KH"
                : dataDeTai.nhom_nganh === "Kỹ thuật Máy tính"
                    ? "KT"
                    : "DN";


        return await this.prismaService.$transaction(async (tx) => {
            const deTai = await tx.de_tai.create({
                data: {
                    ...dataDeTai,
                    ma_de_tai: null,
                    ngay_tao: new Date(),
                    trang_thai: user.sub === id_giang_vien_huong_dan ? "GVHD đã chấp nhận" : "GVHD chưa chấp nhận",
                    trang_thai_duyet: "Chưa duyệt",
                    giai_doan: "Đồ án chuyên ngành",
                    id_tai_khoan_de_xuat: user.sub
                }
            })
            const maDeTai = `${prefix}${deTai.id.toString().padStart(4, "0")}`;
            const deTaiUpdated = await this.update(deTai.id, { ma_de_tai: maDeTai }, tx)


            await this.huongDanService.create({
                vai_tro: "Giảng viên hướng dẫn chính",
                id_giang_vien: id_giang_vien_huong_dan,
                id_de_tai: deTai.id,
                trang_thai: user.sub === id_giang_vien_huong_dan ? "Đã chấp nhận" : "Chưa chấp nhận",
            }, tx)


            await Promise.all(
                list_id_sinh_vien_tham_gia.map((idSinhVien: number) =>
                    this.dangKiService.create({
                        ngay_dang_ky: new Date(),
                        trang_thai: user.sub === idSinhVien ? "Đã chấp nhận" : "Chưa chấp nhận",
                        id_sinh_vien: idSinhVien,
                        id_de_tai: deTai.id
                    }, tx)
                )
            )

            return deTaiUpdated
        });
    }

    async update(id: number | undefined, data: any, tx?: Prisma.TransactionClient) {
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
