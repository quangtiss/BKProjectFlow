import { Module } from '@nestjs/common';
import { HocKyService } from './hoc_ky.service';
import { HocKyController } from './hoc_ky.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HocKyController],
  providers: [HocKyService],
})
export class HocKyModule { }
