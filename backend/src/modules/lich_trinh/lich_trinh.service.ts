import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LichTrinhService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.lich_trinh.findMany();
    }


    async findById(id: number) {
        const lich_trinh = await this.prismaService.lich_trinh.findUnique({
            where: { id },
        });
        return lich_trinh ?? { message: "Không tìm thấy lịch trình" };
    }

    async create(data: any) {
        return await this.prismaService.lich_trinh.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.lich_trinh.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.lich_trinh.delete({
            where: { id }
        })
    }
}
