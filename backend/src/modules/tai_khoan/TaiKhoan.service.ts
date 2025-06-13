import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TaiKhoanService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tai_khoan.findMany();
  }
}
