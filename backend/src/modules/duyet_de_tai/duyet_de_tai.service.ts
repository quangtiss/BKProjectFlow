import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DeTaiService } from '../de_tai/de_tai.service';

@Injectable()
export class DuyetDeTaiService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly deTaiService: DeTaiService
    ) { }

    async findAll() {
        return await this.prismaService.duyet_de_tai.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.duyet_de_tai.findUnique({
            where: { id },
        });

    }

    async create(duyetDeTai: any, idNguoiDuyet: number) {
        await this.deTaiService.update(duyetDeTai.id_de_tai, { trang_thai_duyet: "Đã duyệt" })
        return await this.prismaService.duyet_de_tai.create({
            data: {
                ...duyetDeTai,
                id_nguoi_duyet: idNguoiDuyet,
                ngay_duyet: new Date()
            }

        })
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
