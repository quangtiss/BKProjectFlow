import { Module } from '@nestjs/common';
import { MauDanhGiaService } from './mau_danh_gia.service';
import { MauDanhGiaController } from './mau_danh_gia.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MauDanhGiaController],
  providers: [MauDanhGiaService],
})
export class MauDanhGiaModule { }
