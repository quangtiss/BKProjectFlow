import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChuDeService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.chu_de.findMany();
    }


    async findById(id: number) {
        const chu_de = await this.prismaService.chu_de.findUnique({
            where: { id },
        });
        return chu_de ?? { message: "Không tìm thấy chủ đề" };
    }

    async create(data: any) {
        return await this.prismaService.chu_de.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.chu_de.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.chu_de.delete({
            where: { id }
        })
    }
}
