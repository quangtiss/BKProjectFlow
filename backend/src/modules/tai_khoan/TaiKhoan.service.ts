import { Injectable } from "@nestjs/common";
import { tai_khoan } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class TaiKhoanService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return await this.prisma.tai_khoan.findMany();
  }

  async findOne(ten_tai_khoan: string): Promise<tai_khoan | null> {
    return await this.prisma.tai_khoan.findUnique({
      where: { ten_tai_khoan },
    });
  }

  async findById(id: number): Promise<tai_khoan | any> {
    const taiKhoan = await this.prisma.tai_khoan.findUnique({
      where: { id },
    });
    return taiKhoan ?? { message: "Không tìm thấy tài khoản" };
  }

  async addTaiKhoan(
    data: {
      ten_tai_khoan: string,
      mat_khau: string,
      ho: string,
      ten: string,
      sdt: string,
      cccd: string,
      ngay_sinh: string,
      email: string,
      dia_chi: string,
      gioi_tinh: string,
      vai_tro: string
    }
  ) {
    return await this.prisma.tai_khoan.create({
      data: {
        ...data,
        ngay_sinh: new Date(data.ngay_sinh),
      }
    });
  }
}
