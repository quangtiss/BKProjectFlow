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

    async create(data: any) {
        return await this.prismaService.hoc_ki.create(
            {
                data: {
                    ...data,
                    nam_hoc: parseInt(data.nam_hoc)
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
