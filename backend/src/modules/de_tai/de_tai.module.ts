import { Module } from '@nestjs/common';
import { DeTaiController } from './de_tai.controller';
import { DeTaiService } from './de_tai.service';
import { PrismaModule } from 'prisma/prisma.module';
import { DangKiModule } from '../dang_ki/dang_ki.module';

@Module({
  imports: [PrismaModule, DangKiModule],
  controllers: [DeTaiController],
  providers: [DeTaiService],
})
export class DeTaiModule { }
