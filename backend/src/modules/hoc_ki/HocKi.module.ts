import { Module } from '@nestjs/common';
import { HocKiService } from './HocKi.service';
import { HocKiController } from './HocKi.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HocKiController],
  providers: [HocKiService],
  exports: [HocKiService]
})
export class HocKiModule { }
