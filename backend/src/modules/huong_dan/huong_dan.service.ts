import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class HuongDanService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.huong_dan.findMany();
    }


    async findById(id: number) {
        const huong_dan = await this.prismaService.huong_dan.findUnique({
            where: { id },
        });
        return huong_dan ?? { message: "Không tìm thấy hướng dẫn" };
    }

    async create(data: any) {
        return await this.prismaService.huong_dan.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.huong_dan.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.huong_dan.delete({
            where: { id }
        })
    }
}
