import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UtilsService } from '../a_utils/utils.service';

@Injectable()
export class LichTrinhService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilsService: UtilsService
    ) { }

    async findAllByCurrentHocKy() {
        const CurrentHocKy = await this.utilsService.getCurrentAndNextHocKy()
        return await this.prismaService.lich_trinh.findMany({
            where: { id_hoc_ky: CurrentHocKy.current.id },
            include: {
                giao_vu: { include: { tai_khoan: true } }
            }
        });
    }


    async findById(id: number) {
        return await this.prismaService.lich_trinh.findUnique({
            where: { id },
        });
    }

    async create(data: any, idGiaoVu: number) {
        return await this.prismaService.lich_trinh.create({
            data: {
                ...data,
                ngay_bat_dau: new Date(data.ngay_bat_dau),
                ngay_ket_thuc: new Date(data.ngay_ket_thuc),
                id_nguoi_them: idGiaoVu,
                created_at: new Date()
            }
        })
    }

    async update(id: number, data: any, idGiaoVu: number) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        const lichTrinh = await this.prismaService.lich_trinh.findUnique({ where: { id } })
        if (!lichTrinh) throw new NotFoundException('Không tìm thấy lịch trình')
        if (lichTrinh.id_nguoi_them !== idGiaoVu) throw new ForbiddenException('Bạn không được sửa lịch trình do người khác tạo')
        return await this.prismaService.lich_trinh.update({
            where: { id: id },
            data: {
                ...data,
                ngay_bat_dau: new Date(data.ngay_bat_dau),
                ngay_ket_thuc: new Date(data.ngay_ket_thuc),
                updated_at: new Date()
            }
        })
    }

    async delete(id: number, idGiaoVu: number) {
        const lichTrinh = await this.prismaService.lich_trinh.findUnique({ where: { id } })
        if (!lichTrinh) throw new NotFoundException('Không tìm thấy lịch trình')
        if (lichTrinh.id_nguoi_them !== idGiaoVu) throw new ForbiddenException('Bạn không được sửa lịch trình do người khác tạo')
        return this.prismaService.lich_trinh.delete({
            where: { id }
        })
    }
}
