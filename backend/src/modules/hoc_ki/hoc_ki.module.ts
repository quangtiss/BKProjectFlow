import { Module } from '@nestjs/common';
import { HocKiService } from './hoc_ki.service';
import { HocKiController } from './hoc_ki.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HocKiController],
  providers: [HocKiService],
})
export class HocKiModule { }
