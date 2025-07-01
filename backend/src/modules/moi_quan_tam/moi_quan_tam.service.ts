import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MoiQuanTamService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.moi_quan_tam.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.moi_quan_tam.findUnique({
            where: { id },
        });
    }

    async create(data: any) {
        return await this.prismaService.moi_quan_tam.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.moi_quan_tam.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.moi_quan_tam.delete({
            where: { id }
        })
    }
}
