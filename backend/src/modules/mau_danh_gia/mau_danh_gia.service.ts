import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MauDanhGiaService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.mau_danh_gia.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.mau_danh_gia.findUnique({
            where: { id },
        });
    }

    async findWithGiangVien(query) {
        return await this.prismaService.mau_danh_gia.findFirst({
            where: {
                loai_mau: query.loai_mau,
                giai_doan: query.giai_doan
            },
            include: {
                nhom_tieu_chi: {
                    include: {
                        tieu_chi: true
                    }
                }
            }
        })
    }

    async create(data: any) {
        return await this.prismaService.mau_danh_gia.create(
            { data }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.mau_danh_gia.update({
            where: { id: id },
            data: {
                ...data,
                ghi_chu: data.ghi_chu ?? null
            }
        })
    }

    async delete(id: number) {
        return this.prismaService.$transaction(async (tx) => {
            await tx.tieu_chi.deleteMany({
                where: { nhom_tieu_chi: { id_mau_danh_gia: id } }
            })
            await tx.nhom_tieu_chi.deleteMany({
                where: { id_mau_danh_gia: id }
            })
            return tx.mau_danh_gia.delete({ where: { id } })
        })
    }
}
