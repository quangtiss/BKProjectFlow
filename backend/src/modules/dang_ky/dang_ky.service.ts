import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DangKiService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll(query: object) {
        return await this.prismaService.dang_ky.findMany({
            where: query,
            include: {
                de_tai: {
                    include: {
                        tai_khoan: {
                            include: {
                                sinh_vien: true,
                                giang_vien: true,
                                giao_vu: true,
                                giang_vien_truong_bo_mon: true
                            }
                        }
                    }
                }
            }
        });
    }


    async findByCurrentSinhVien(id: number, query: object) {
        return await this.prismaService.dang_ky.findMany({
            where: {
                id_sinh_vien: id,
                ...query
            },
            include: {
                de_tai: {
                    include: {
                        tai_khoan: {
                            include: {
                                sinh_vien: true,
                                giang_vien: true,
                                giao_vu: true,
                                giang_vien_truong_bo_mon: true
                            }
                        }
                    }
                }
            }
        });
    }

    async create(data: any, tx?: Prisma.TransactionClient) {
        const client = tx ?? this.prismaService;
        return await client.dang_ky.create(
            { data }
        )
    }

    async update(id: number, data: any, idSinhVien: number) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        const dangKy = await this.prismaService.dang_ky.findUnique({
            where: { id }
        })
        if (dangKy?.id_sinh_vien !== idSinhVien) {
            throw new Error("Bạn không có quyền")
        }
        return await this.prismaService.dang_ky.update({
            where: { id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.dang_ky.delete({
            where: { id }
        })
    }
}
