import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ThamGiaService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.tham_gia.findMany();
    }


    async findById(id: number) {
        const tham_gia = await this.prismaService.tham_gia.findUnique({
            where: { id },
        });
        return tham_gia ?? { message: "Không tìm thấy tham gia" };
    }

    async create(data: any) {
        return await this.prismaService.tham_gia.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.tham_gia.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.tham_gia.delete({
            where: { id }
        })
    }
}
