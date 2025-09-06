import { Module } from '@nestjs/common';
import { TaiLieuService } from './tai_lieu.service';
import { TaiLieuController } from './tai_lieu.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaiLieuController],
  providers: [TaiLieuService],
})
export class TaiLieuModule { }
