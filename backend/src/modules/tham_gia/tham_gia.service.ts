import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ThamGiaService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.tham_gia.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.tham_gia.findUnique({
            where: { id },
        });
    }

    async create(data: any) {
        if (!data.id_hoi_dong || !data.list_giang_vien) {
            throw new NotFoundException('Dữ liệu không hợp lệ')
        }
        const hoiDong = await this.prismaService.hoi_dong.findUnique({ where: { id: data.id_hoi_dong } })
        if (!hoiDong) throw new NotFoundException('Không tìm thấy hội đồng')
        const listThamGia = await this.prismaService.tham_gia.findMany({
            where: { id_hoi_dong: data.id_hoi_dong },
            select: { id: true, id_giang_vien: true, vai_tro: true }
        })
        return await this.prismaService.$transaction(async (tx) => {
            if (listThamGia && listThamGia.length > 0) {
                const listUpdate = data.list_giang_vien.filter((gv: any) => listThamGia.some((tg: any) => tg.id_giang_vien === gv.id_tai_khoan))
                const listCreate = data.list_giang_vien.filter((gv: any) => !listThamGia.some((tg: any) => tg.id_giang_vien === gv.id_tai_khoan))
                const listDelete = listThamGia.filter((tg: any) => !data.list_giang_vien.some((gv: any) => gv.id_tai_khoan === tg.id_giang_vien))
                // Cập nhật vai trò
                for (const gv of listUpdate) {
                    await tx.tham_gia.updateMany({
                        where: { id_giang_vien: gv.id_tai_khoan, id_hoi_dong: data.id_hoi_dong },
                        data: { vai_tro: gv.role }
                    });
                }
                // Xóa giảng viên không còn trong danh sách
                for (const tg of listDelete) {
                    await tx.tham_gia.deleteMany({
                        where: { id: tg.id }
                    });
                }
                // Thêm giảng viên mới
                for (const gv of listCreate) {
                    await tx.tham_gia.create({
                        data: {
                            id_hoi_dong: data.id_hoi_dong,
                            id_giang_vien: gv.id_tai_khoan,
                            vai_tro: gv.role,
                        },
                    });
                }
            } else {
                for (const gv of data.list_giang_vien) {
                    await tx.tham_gia.create({
                        data: {
                            id_hoi_dong: data.id_hoi_dong,
                            id_giang_vien: gv.id_tai_khoan,
                            vai_tro: gv.role,
                        },
                    });
                }
            }
            return { message: 'Thêm giảng viên vào hội đồng thành công' };
        })
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.tham_gia.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.tham_gia.delete({
            where: { id }
        })
    }
}
