import { Module } from '@nestjs/common';
import { ThucHienService } from './thuc_hien.service';
import { ThucHienController } from './thuc_hien.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ThucHienController],
  providers: [ThucHienService],
})
export class ThucHienModule { }
