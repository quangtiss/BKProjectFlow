import { Module } from '@nestjs/common';
import { MoiQuanTamService } from './moi_quan_tam.service';
import { MoiQuanTamController } from './moi_quan_tam.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MoiQuanTamController],
  providers: [MoiQuanTamService],
})
export class MoiQuanTamModule { }
