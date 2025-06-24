import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChamDiemService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.cham_diem.findMany();
    }


    async findById(id: number) {
        const cham_diem = await this.prismaService.cham_diem.findUnique({
            where: { id },
        });
        return cham_diem ?? { message: "Không tìm thấy chấm điểm" };
    }

    async create(data: any) {
        return await this.prismaService.cham_diem.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.cham_diem.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.cham_diem.delete({
            where: { id }
        })
    }
}
