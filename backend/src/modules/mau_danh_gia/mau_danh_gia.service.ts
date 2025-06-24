import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MauDanhGiaService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.mau_danh_gia.findMany();
    }


    async findById(id: number) {
        const mau_danh_gia = await this.prismaService.mau_danh_gia.findUnique({
            where: { id },
        });
        return mau_danh_gia ?? { message: "Không tìm thấy mẫu đánh giá" };
    }

    async create(data: any) {
        return await this.prismaService.mau_danh_gia.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.mau_danh_gia.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.mau_danh_gia.delete({
            where: { id }
        })
    }
}
