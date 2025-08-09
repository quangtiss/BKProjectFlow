import { Module } from '@nestjs/common';
import { ThongBaoService } from './thong_bao.service';
import { ThongBaoController } from './thong_bao.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ThongBaoController],
  providers: [ThongBaoService],
  exports: [ThongBaoService]
})
export class ThongBaoModule { }
