import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class HoiDongService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.hoi_dong.findMany();
    }


    async findByIdHocKy(id: number) {
        return await this.prismaService.hoi_dong.findMany({
            where: { id_hoc_ky: id },
            include: {
                danh_gia: {
                    include: {
                        de_tai: true
                    }
                },
                tham_gia: {
                    include: {
                        giang_vien: {
                            include: { tai_khoan: true }
                        }
                    }
                }
            }
        });

    }

    async create(data: any) {
        return await this.prismaService.hoi_dong.create({
            data: {
                ...data,
                ngay_gio: new Date(data.ngay_gio)
            }
        })
    }

    async phanChiaDeTai(data: any) {
        if (!data.id_hoi_dong || !data.list_de_tai || data.list_de_tai.length === 0) {
            throw new NotFoundException('Dữ liệu không hợp lệ')
        }
        const hoiDong = await this.prismaService.hoi_dong.findUnique({ where: { id: data.id_hoi_dong } })
        if (!hoiDong) throw new NotFoundException('Không tìm thấy hội đồng')
        return await this.prismaService.$transaction(async (tx) => {
            // Cập nhật các đề tài
            await tx.danh_gia.createMany({
                data: data.list_de_tai.map((id) => ({
                    id_de_tai: id,              // id là number
                    id_hoi_dong: data.id_hoi_dong,
                    trang_thai: 'Chưa chấm'
                })),
            });
            return { message: 'Phân chia đề tài thành công' };
        });
    }

    async removeDeTaiFromHoiDong(idDeTai: number) {
        const deTai = await this.prismaService.de_tai.findUnique({
            where: { id: idDeTai },
            include: {
                danh_gia: {
                    include: {
                        hoi_dong: true
                    }
                }
            }
        })
        if (!deTai || deTai.danh_gia.length === 0) throw new NotFoundException('Không tìm thấy đề tài, hoặc đề tài chưa được phân cho hội đồng')

        return await this.prismaService.danh_gia.deleteMany({
            where: {
                id_de_tai: idDeTai,
                trang_thai: 'Chưa chấm'
            },
        })
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        const hoiDong = await this.prismaService.hoi_dong.findUnique({ where: { id } })
        if (!hoiDong) throw new NotFoundException('Không tìm thấy hội đồng')
        return await this.prismaService.hoi_dong.update({
            where: { id: id },
            data: {
                ...data,
                ngay_gio: new Date(data.ngay_gio)
            }
        })
    }

    async delete(id: number) {
        return this.prismaService.$transaction(async (tx) => {
            await tx.danh_gia.deleteMany({
                where: { id_hoi_dong: id }
            })
            await tx.tham_gia.deleteMany({
                where: { id_hoi_dong: id }
            })
            return await tx.hoi_dong.delete({
                where: { id }
            })
        })
    }
}
