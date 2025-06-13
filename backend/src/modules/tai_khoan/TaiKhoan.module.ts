import { TaiKhoanService } from './TaiKhoan.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TaiKhoanController } from './TaiKhoan.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TaiKhoanController],
  providers: [TaiKhoanService],
  exports: [TaiKhoanService],
})
export class TaiKhoanModule {}
