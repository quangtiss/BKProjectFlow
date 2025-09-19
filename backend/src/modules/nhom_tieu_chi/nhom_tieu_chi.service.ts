import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class NhomTieuChiService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(body) {
    return await this.prismaService.nhom_tieu_chi.create({
      data: {
        ten_nhom: body.ten_nhom,
        id_mau_danh_gia: body.id_mau_danh_gia
      }
    })
  }

  async findAll() {
    return await this.prismaService.nhom_tieu_chi.findMany({ include: { tieu_chi: true } })
  }

  async findByIdMauDanhGia(id: number) {
    return await this.prismaService.nhom_tieu_chi.findMany({ where: { id_mau_danh_gia: id }, include: { tieu_chi: true } })
  }

  async update(body) {
    return await this.prismaService.nhom_tieu_chi.update({
      where: { id: body.id },
      data: { ten_nhom: body.ten_nhom }
    })
  }

  async remove(id: number) {
    return this.prismaService.$transaction(async (tx) => {
      await tx.tieu_chi.deleteMany({ where: { id_nhom_tieu_chi: id } })
      return await tx.nhom_tieu_chi.delete({ where: { id } })
    })
  }
}
