import { Injectable, forwardRef, Inject } from '@nestjs/common';
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

    async findWithCurrentGiangVien(query, user) {
        return this.prismaService.huong_dan.findMany({
            where: {
                ...query,
                id_giang_vien: user.sub
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
        })
    }

    async findById(id: number) {
        return await this.prismaService.huong_dan.findUnique({
            where: { id },
            include: {
                de_tai: true
            }
        });
    }

    async create(data: any, tx?: Prisma.TransactionClient) {
        const client = tx ?? this.prismaService;
        return await client.huong_dan.create(
            { data }
        )
    }

    async update(idHuongDan: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        const dataCurrentHuongDan = await this.findById(idHuongDan)
        await this.deTaiService.update(dataCurrentHuongDan?.de_tai?.id, data)
        return await this.prismaService.huong_dan.update({
            where: { id: idHuongDan },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.huong_dan.delete({
            where: { id }
        })
    }
}
