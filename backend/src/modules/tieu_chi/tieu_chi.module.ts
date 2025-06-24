import { Module } from '@nestjs/common';
import { TieuChiService } from './tieu_chi.service';
import { TieuChiController } from './tieu_chi.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TieuChiController],
  providers: [TieuChiService],
})
export class TieuChiModule { }
