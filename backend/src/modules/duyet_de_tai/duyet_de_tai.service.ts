import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DuyetDeTaiService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.duyet_de_tai.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.duyet_de_tai.findUnique({
            where: { id },
        });

    }

    async create(data: any) {
        return await this.prismaService.duyet_de_tai.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.duyet_de_tai.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.duyet_de_tai.delete({
            where: { id }
        })
    }
}
