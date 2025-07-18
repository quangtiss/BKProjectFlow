import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SinhVienService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.sinh_vien.findMany({
            include: {
                tai_khoan: true
            }
        });
    }


    async findById(id_tai_khoan: number) {
        return await this.prismaService.sinh_vien.findUnique({
            where: { id_tai_khoan },
        });
    }

    async findByMaSo(mssv: string) {
        const sinh_vien = await this.prismaService.sinh_vien.findUnique({
            where: { mssv },
        });
        return sinh_vien
    }

    async create(data: any) {
        return await this.prismaService.sinh_vien.create(
            {
                data: {
                    ...data,
                    nam_dao_tao: parseInt(data.nam_dao_tao)
                }
            }
        )
    }

    async update(id_tai_khoan: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.sinh_vien.update({
            where: { id_tai_khoan: id_tai_khoan },
            data: data
        })
    }

    async delete(id_tai_khoan: number) {
        return this.prismaService.sinh_vien.delete({
            where: { id_tai_khoan }
        })
    }
}
