import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class HocKyService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.hoc_ky.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.hoc_ky.findUnique({
            where: { id },
        });

    }

    async create(data: any, idNguoiThem) {
        return await this.prismaService.hoc_ky.create(
            {
                data: {
                    ...data,
                    id_nguoi_them: idNguoiThem
                }
            }
        )
    }

    async update(id: number, data: any, idNguoiSua: number) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        const hocKy = await this.prismaService.hoc_ky.findUnique({ where: { id: id } })
        if (!hocKy) throw new NotFoundException('Không tìm thấy học kỳ')
        if (hocKy.id_nguoi_them !== idNguoiSua) throw new ForbiddenException('Bạn không phải là người thêm học kì này')
        return await this.prismaService.hoc_ky.update({
            where: { id: id },
            data: data
        })
    }

    // async delete(id: number, idNguoiXoa: number) {
    //     const hocKy = await this.prismaService.hoc_ky.findUnique({ where: { id: id } })
    //     if (!hocKy) throw new NotFoundException('Không tìm thấy học kỳ')
    //     if (hocKy.id_nguoi_them !== idNguoiXoa) throw new ForbiddenException('Bạn không phải là người thêm học kì này')
    //     return this.prismaService.hoc_ky.delete({
    //         where: { id }
    //     })
    // }
}
