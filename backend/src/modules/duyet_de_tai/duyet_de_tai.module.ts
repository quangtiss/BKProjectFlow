import { Module } from '@nestjs/common';
import { DuyetDeTaiController } from './duyet_de_tai.controller';
import { DuyetDeTaiService } from './duyet_de_tai.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DuyetDeTaiController],
  providers: [DuyetDeTaiService]
})
export class DuyetDeTaiModule { }
