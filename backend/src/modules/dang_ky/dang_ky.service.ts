import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DangKiService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.dang_ky.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.dang_ky.findUnique({
            where: { id },
        });
    }

    async create(data: any, tx?: Prisma.TransactionClient) {
        const client = tx ?? this.prismaService;
        return await client.dang_ky.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.dang_ky.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.dang_ky.delete({
            where: { id }
        })
    }
}
