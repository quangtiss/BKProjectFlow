import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TinNhanService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.tin_nhan.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.tin_nhan.findUnique({
            where: { id },
        });
    }

    async create(data: any) {
        return await this.prismaService.tin_nhan.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.tin_nhan.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.tin_nhan.delete({
            where: { id }
        })
    }
}
