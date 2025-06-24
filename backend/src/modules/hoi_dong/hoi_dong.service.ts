import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class HoiDongService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.hoi_dong.findMany();
    }


    async findById(id: number) {
        const hoi_dong = await this.prismaService.hoi_dong.findUnique({
            where: { id },
        });
        return hoi_dong ?? { message: "Không tìm thấy hội đồng" };
    }

    async create(data: any) {
        return await this.prismaService.hoi_dong.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.hoi_dong.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.hoi_dong.delete({
            where: { id }
        })
    }
}
