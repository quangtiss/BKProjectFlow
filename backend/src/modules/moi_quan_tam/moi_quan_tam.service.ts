import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MoiQuanTamService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.moi_quan_tam.findMany();
    }


    async findByIdUser(id: number) {
        return await this.prismaService.moi_quan_tam.findMany({
            where: { id_sinh_vien: id },
        });
    }

    async create(data: any) {
        if (data.list_id_chu_de) {
            return await this.prismaService.$transaction(async (tx) => {
                const oldList = await tx.moi_quan_tam.findMany({
                    where: { id_sinh_vien: data.id_user },
                    select: { id_chu_de: true }
                })

                const oldIds = oldList.map(o => o.id_chu_de)

                // Xác định cần xoá
                const idsToDelete = oldIds.filter((id): id is number => !data.list_id_chu_de.includes(id))
                // Xác định cần thêm
                const idsToAdd = data.list_id_chu_de.filter(id => !oldIds.includes(id))

                if (idsToDelete.length > 0) {
                    await tx.moi_quan_tam.deleteMany({
                        where: {
                            id_sinh_vien: data.id_user,
                            id_chu_de: { in: idsToDelete }
                        }
                    })
                }

                if (idsToAdd.length > 0) {
                    await tx.moi_quan_tam.createMany({
                        data: idsToAdd.map((id) => ({
                            id_sinh_vien: data.id_user,
                            id_chu_de: id
                        }))
                    })
                }

                // trả về danh sách hiện tại sau khi sync
                return await tx.moi_quan_tam.findMany({
                    where: { id_sinh_vien: data.id_user }
                })
            })
        }

        // nếu không có list_id_chu_de thì tạo mới một record
        return await this.prismaService.moi_quan_tam.create({ data })
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.moi_quan_tam.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.moi_quan_tam.delete({
            where: { id }
        })
    }
}
