import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ThucHienService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.thuc_hien.findMany();
    }


    async findById(id: number) {
        const thuc_hien = await this.prismaService.thuc_hien.findUnique({
            where: { id },
        });
        return thuc_hien ?? { message: "Không tìm thấy thực hiện" };
    }

    async create(data: any) {
        return await this.prismaService.thuc_hien.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.thuc_hien.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.thuc_hien.delete({
            where: { id }
        })
    }
}
