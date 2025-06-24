import { Module } from '@nestjs/common';
import { LichTrinhService } from './lich_trinh.service';
import { LichTrinhController } from './lich_trinh.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LichTrinhController],
  providers: [LichTrinhService],
})
export class LichTrinhModule { }
