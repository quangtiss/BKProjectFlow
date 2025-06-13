import { Injectable } from '@nestjs/common';
import { tai_khoan } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TaiKhoanService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tai_khoan.findMany();
  }

  async findOne(ten_tai_khoan: string): Promise<tai_khoan | null> {
    return this.prisma.tai_khoan.findFirst({
      where: { ten_tai_khoan },
    });
  }
}
