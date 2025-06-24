import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DeTaiService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.de_tai.findMany();
    }


    async findById(id: number) {
        const de_tai = await this.prismaService.de_tai.findUnique({
            where: { id },
        });
        return de_tai ?? { message: "Không tìm thấy đề tài" };
    }

    async create(data: any) {
        return await this.prismaService.de_tai.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.de_tai.update({
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
