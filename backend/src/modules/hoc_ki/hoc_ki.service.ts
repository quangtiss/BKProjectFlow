import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class HocKiService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.hoc_ki.findMany();
    }


    async findById(id: number) {
        return await this.prismaService.hoc_ki.findUnique({
            where: { id },
        });

    }

    async create(data: any, idNguoiThem) {
        return await this.prismaService.hoc_ki.create(
            {
                data: {
                    ...data,
                    id_nguoi_them: idNguoiThem
                }
            }
        )
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.hoc_ki.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.hoc_ki.delete({
            where: { id }
        })
    }
}
