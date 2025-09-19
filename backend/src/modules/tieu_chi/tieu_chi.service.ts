import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TieuChiService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.tieu_chi.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.tieu_chi.findUnique({
            where: { id },
        });
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
        const { id_tieu_chi, ...rest } = data
        return await this.prismaService.tieu_chi.update({
            where: { id: id_tieu_chi },
            data: rest
        })
    }

    async delete(id: number) {
        return this.prismaService.tieu_chi.delete({
            where: { id }
        })
    }
}
