import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class HocKiService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.hoc_ki.findMany();
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
}
