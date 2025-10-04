import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PhanBienService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(data: any) {
    return await this.prismaService.phan_bien.create({
      data: {
        id_de_tai: data.id_de_tai,
        id_giang_vien: data.id_giang_vien,
        trang_thai: 'Chưa chấm'
      }
    })
  }


  async update(data: any) {
    return await this.prismaService.phan_bien.updateMany({
      where: {
        id_de_tai: data.id_de_tai,
        trang_thai: 'Chưa chấm'
      },
      data: {
        id_giang_vien: data.id_giang_vien,
      }
    })
  }
}
