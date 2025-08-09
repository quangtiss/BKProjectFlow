import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GiangVienService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.giang_vien.findMany({
            include: {
                tai_khoan: true
            }
        });
    }


    async findById(id_tai_khoan: number, tx?: Prisma.TransactionClient) {
        const client = tx || this.prismaService
        return await client.giang_vien.findUnique({
            where: { id_tai_khoan },
            include: {
                tai_khoan: true
            }
        });

    }

    async findByMaSo(msgv: string) {
        const giang_vien = await this.prismaService.giang_vien.findUnique({
            where: { msgv },
        });
        return giang_vien
    }

    async create(data: any) {
        return await this.prismaService.giang_vien.create(
            { data }
        )
    }

    async update(id_tai_khoan: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.giang_vien.update({
            where: { id_tai_khoan: id_tai_khoan },
            data: data
        })
    }

    async delete(id_tai_khoan: number) {
        return this.prismaService.giang_vien.delete({
            where: { id_tai_khoan }
        })
    }
}
