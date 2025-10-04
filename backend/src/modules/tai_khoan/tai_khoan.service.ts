import { Injectable } from "@nestjs/common";
import { tai_khoan } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class TaiKhoanService {
  constructor(private prismaService: PrismaService) { }

  async findAll() {
    return await this.prismaService.tai_khoan.findMany({
      include: {
        sinh_vien: true,
        giang_vien: true,
        giao_vu: true,
      }
    });
  }

  async findOne(ten_tai_khoan: string): Promise<tai_khoan | null> {
    return await this.prismaService.tai_khoan.findUnique({
      where: { ten_tai_khoan },
    });
  }

  async findById(id: number): Promise<tai_khoan | any> {
    return await this.prismaService.tai_khoan.findUnique({
      where: { id },
      include: {
        sinh_vien: true,
        giang_vien: true,
        giao_vu: true
      }
    });

  }

  async create(data: any) {
    return await this.prismaService.tai_khoan.create({
      data
    });
  }

  async update(id: number, data: any) {
    if (!data || Object.keys(data).length === 0) {
      // Không có gì để cập nhật
      return null;
    }
    return await this.prismaService.tai_khoan.update({
      where: { id: id },
      data: {
        ...data,
        ngay_sinh: new Date(data.ngay_sinh)
      }
    })
  }

  async delete(id: number) {
    return this.prismaService.tai_khoan.delete({
      where: { id }
    })
  }
}
