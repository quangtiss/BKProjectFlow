import { Module } from '@nestjs/common';
import { DeTaiController } from './de_tai.controller';
import { DeTaiService } from './de_tai.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DeTaiController],
  providers: [DeTaiService],
})
export class DeTaiModule { }
