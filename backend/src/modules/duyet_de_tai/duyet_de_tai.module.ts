import { Module } from '@nestjs/common';
import { DuyetDeTaiController } from './duyet_de_tai.controller';
import { DuyetDeTaiService } from './duyet_de_tai.service';
import { PrismaModule } from 'prisma/prisma.module';
import { DeTaiModule } from '../de_tai/de_tai.module';

@Module({
  imports: [PrismaModule, DeTaiModule],
  controllers: [DuyetDeTaiController],
  providers: [DuyetDeTaiService]
})
export class DuyetDeTaiModule { }
