import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GiaoVuService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.giao_vu.findMany();
    }


    async findById(id_tai_khoan: number) {
        const giao_vu = await this.prismaService.giao_vu.findUnique({
            where: { id_tai_khoan },
        });
        return giao_vu ?? { message: "Không tìm thấy giáo vụ" };
    }

    async findByMaSo(msnv: string) {
        const giao_vu = await this.prismaService.giao_vu.findUnique({
            where: { msnv },
        });
        return giao_vu
    }

    async create(data: any) {
        return await this.prismaService.giao_vu.create(
            { data }
        )
    }

    async update(id_tai_khoan: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.giao_vu.update({
            where: { id_tai_khoan: id_tai_khoan },
            data: data
        })
    }

    async delete(id_tai_khoan: number) {
        return this.prismaService.giao_vu.delete({
            where: { id_tai_khoan }
        })
    }
}
