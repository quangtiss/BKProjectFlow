import { Module } from '@nestjs/common';
import { ChamDiemService } from './cham_diem.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ChamDiemController } from './cham_diem.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ChamDiemController],
  providers: [ChamDiemService]
})
export class ChamDiemModule { }
