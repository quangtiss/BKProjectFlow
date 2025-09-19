import { Module } from '@nestjs/common';
import { NhomTieuChiService } from './nhom_tieu_chi.service';
import { NhomTieuChiController } from './nhom_tieu_chi.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NhomTieuChiController],
  providers: [NhomTieuChiService],
})
export class NhomTieuChiModule { }
