import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GiangVienService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.giang_vien.findMany();
    }


    async findById(id_tai_khoan: number) {
        const giang_vien = await this.prismaService.giang_vien.findUnique({
            where: { id_tai_khoan },
        });
        return giang_vien ?? { message: "Không tìm thấy giảng viên" };
    }

    async findByMaSo(msgv: string) {
        const giang_vien = await this.prismaService.giang_vien.findUnique({
            where: { msgv },
        });
        return giang_vien
    }

    async create(data: any) {
        return await this.prismaService.giang_vien.create(
            { data }
        )
    }

    async update(id_tai_khoan: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.giang_vien.update({
            where: { id_tai_khoan: id_tai_khoan },
            data: data
        })
    }

    async delete(id_tai_khoan: number) {
        return this.prismaService.giang_vien.delete({
            where: { id_tai_khoan }
        })
    }
}
