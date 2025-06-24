import { Module } from '@nestjs/common';
import { NhiemVuService } from './nhiem_vu.service';
import { NhiemVuController } from './nhiem_vu.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NhiemVuController],
  providers: [NhiemVuService],
})
export class NhiemVuModule { }
