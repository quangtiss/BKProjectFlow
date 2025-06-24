import { Module } from '@nestjs/common';
import { HoiDongService } from './hoi_dong.service';
import { HoiDongController } from './hoi_dong.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HoiDongController],
  providers: [HoiDongService],
})
export class HoiDongModule { }
