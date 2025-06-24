import { TaiKhoanService } from './tai_khoan.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TaiKhoanController } from './tai_khoan.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TaiKhoanController],
  providers: [TaiKhoanService],
  exports: [TaiKhoanService],
})
export class TaiKhoanModule { }
