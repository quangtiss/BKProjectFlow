import { Module } from '@nestjs/common';
import { GiaoVuService } from './giao_vu.service';
import { GiaoVuController } from './giao_vu.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GiaoVuController],
  providers: [GiaoVuService],
})
export class GiaoVuModule { }
