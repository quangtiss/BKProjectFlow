import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TieuChiService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.tieu_chi.findMany();
    }


    async findById(id: number) {
        const tieu_chi = await this.prismaService.tieu_chi.findUnique({
            where: { id },
        });
        return tieu_chi ?? { message: "Không tìm thấy tiêu chí" };
    }

    async create(data: any) {
        return await this.prismaService.tieu_chi.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.tieu_chi.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.tieu_chi.delete({
            where: { id }
        })
    }
}
