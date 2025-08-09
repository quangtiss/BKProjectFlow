import { Injectable, forwardRef, Inject, Query } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DeTaiService } from '../de_tai/de_tai.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HuongDanService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => DeTaiService))
        private readonly deTaiService: DeTaiService
    ) { }

    async findAll() {
        return await this.prismaService.huong_dan.findMany();
    }


    async findByCurrentIdGiangVien(idGiangVien: number, query: object) {
        return this.prismaService.huong_dan.findMany({
            where: {
                ...query,
                id_giang_vien: idGiangVien
            },
            include: {
                de_tai: {
                    include: {
                        tai_khoan: {
                            include: {
                                sinh_vien: true,
                                giang_vien: true,
                            }
                        },
                        huong_dan: {
                            where: {
                                trang_thai: "Đã chấp nhận"
                            },
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
                    }
                }
            }
        })
    }

    async create(data: any, tx?: Prisma.TransactionClient) {
        const client = tx ?? this.prismaService;
        return await client.huong_dan.create(
            { data }
        )
    }

    async findById(id: number, tx?: Prisma.TransactionClient) {
        const client = tx ?? this.prismaService
        return client.huong_dan.findUnique({
            where: { id },
            include: {
                de_tai: true
            }
        })
    }

    async findByIdDeTai(idDeTai: number, query: object) {
        return this.prismaService.huong_dan.findMany({
            where: {
                id_de_tai: idDeTai,
                ...query
            },
            include: {
                giang_vien: true
            }
        })
    }

    async update(idHuongDan: number, data: any, idUserLoggin: number) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }

        return await this.prismaService.$transaction(async (tx) => {
            const dataCurrentHuongDan = await this.findById(idHuongDan, tx)
            if (dataCurrentHuongDan?.id_giang_vien !== idUserLoggin) throw new Error("Bạn không có quyền!")

            if (!dataCurrentHuongDan?.de_tai?.id) throw new Error("Không tìm thấy id của đề tài thuộc phần quyền của bạn")
            await this.deTaiService.update(dataCurrentHuongDan?.de_tai?.id, {
                trang_thai: data.trang_thai === "Đã chấp nhận" ? "GVHD đã chấp nhận" :
                    data.trang_thai === "Đã từ chối" ? "GVHD đã từ chối" : "GVHD chưa chấp nhận"
            }, tx)

            return await tx.huong_dan.update({
                where: { id: idHuongDan },
                data: data
            })
        })
    }

    async delete(id: number) {
        return this.prismaService.huong_dan.delete({
            where: { id }
        })
    }
}
