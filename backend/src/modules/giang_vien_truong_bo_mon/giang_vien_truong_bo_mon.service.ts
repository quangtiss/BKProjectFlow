import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GiangVienTruongBoMonService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.giang_vien_truong_bo_mon.findMany();
    }


    async findById(id_tai_khoan: number) {
        const giang_vien_truong_bo_mon = await this.prismaService.giang_vien_truong_bo_mon.findUnique({
            where: { id_tai_khoan },
        });
        return giang_vien_truong_bo_mon ?? { message: "Không tìm thấy giảng viên trưởng bộ môn" };
    }

    async findByMaSo(msgv: string) {
        const giang_vien_truong_bo_mon = await this.prismaService.giang_vien_truong_bo_mon.findUnique({
            where: { msgv },
        });
        return giang_vien_truong_bo_mon
    }

    async create(data: any) {
        return await this.prismaService.giang_vien_truong_bo_mon.create(
            { data }
        )
    }

    async update(id_tai_khoan: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.giang_vien_truong_bo_mon.update({
            where: { id_tai_khoan: id_tai_khoan },
            data: data
        })
    }

    async delete(id_tai_khoan: number) {
        return this.prismaService.giang_vien_truong_bo_mon.delete({
            where: { id_tai_khoan }
        })
    }
}
