import { Module } from '@nestjs/common';
import { PhanBienService } from './phan_bien.service';
import { PhanBienController } from './phan_bien.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PhanBienController],
  providers: [PhanBienService],
})
export class PhanBienModule { }
