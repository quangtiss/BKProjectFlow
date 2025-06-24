import { Module } from '@nestjs/common';
import { ThamGiaService } from './tham_gia.service';
import { ThamGiaController } from './tham_gia.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ThamGiaController],
  providers: [ThamGiaService],
})
export class ThamGiaModule { }
