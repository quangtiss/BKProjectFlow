import { forwardRef, Module } from '@nestjs/common';
import { DeTaiController } from './de_tai.controller';
import { DeTaiService } from './de_tai.service';
import { PrismaModule } from 'prisma/prisma.module';
import { DangKiModule } from '../dang_ky/dang_ky.module';
import { HuongDanModule } from '../huong_dan/huong_dan.module';

@Module({
  imports: [PrismaModule, DangKiModule, forwardRef(() => HuongDanModule)],
  controllers: [DeTaiController],
  providers: [DeTaiService],
  exports: [DeTaiService]
})
export class DeTaiModule { }
