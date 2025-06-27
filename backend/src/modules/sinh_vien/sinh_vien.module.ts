import { Module } from '@nestjs/common';
import { SinhVienService } from './sinh_vien.service';
import { SinhVienController } from './sinh_vien.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SinhVienController],
  providers: [SinhVienService],
  exports: [SinhVienService]
})
export class SinhVienModule { }
