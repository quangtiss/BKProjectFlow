import { Module } from '@nestjs/common';
import { GiangVienTruongBoMonService } from './giang_vien_truong_bo_mon.service';
import { GiangVienTruongBoMonController } from './giang_vien_truong_bo_mon.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GiangVienTruongBoMonController],
  providers: [GiangVienTruongBoMonService],
})
export class GiangVienTruongBoMonModule { }
