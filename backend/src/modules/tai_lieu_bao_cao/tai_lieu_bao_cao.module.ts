import { Module } from '@nestjs/common';
import { TaiLieuBaoCaoService } from './tai_lieu_bao_cao.service';
import { TaiLieuBaoCaoController } from './tai_lieu_bao_cao.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaiLieuBaoCaoController],
  providers: [TaiLieuBaoCaoService],
})
export class TaiLieuBaoCaoModule { }
