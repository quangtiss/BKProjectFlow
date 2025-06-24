import { Module } from '@nestjs/common';
import { HuongDanService } from './huong_dan.service';
import { HuongDanController } from './huong_dan.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HuongDanController],
  providers: [HuongDanService],
})
export class HuongDanModule { }
