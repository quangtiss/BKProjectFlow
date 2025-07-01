import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChinhSuaService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.chinh_sua.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.chinh_sua.findUnique({
            where: { id },
        });
    }

    async create(data: any) {
        return await this.prismaService.chinh_sua.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.chinh_sua.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.chinh_sua.delete({
            where: { id }
        })
    }
}
