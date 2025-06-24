import { Module } from '@nestjs/common';
import { GiangVienService } from './giang_vien.service';
import { GiangVienController } from './giang_vien.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GiangVienController],
  providers: [GiangVienService],
})
export class GiangVienModule { }
