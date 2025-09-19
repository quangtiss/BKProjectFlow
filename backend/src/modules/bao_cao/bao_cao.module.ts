import { Module } from '@nestjs/common';
import { BaoCaoService } from './bao_cao.service';
import { BaoCaoController } from './bao_cao.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BaoCaoController],
  providers: [BaoCaoService],
})
export class BaoCaoModule { }
