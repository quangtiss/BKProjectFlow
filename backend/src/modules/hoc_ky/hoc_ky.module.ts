import { Module } from '@nestjs/common';
import { HocKiService } from './hoc_ky.service';
import { HocKiController } from './hoc_ky.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HocKiController],
  providers: [HocKiService],
})
export class HocKiModule { }
