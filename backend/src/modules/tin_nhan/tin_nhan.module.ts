import { Module } from '@nestjs/common';
import { TinNhanService } from './tin_nhan.service';
import { TinNhanController } from './tin_nhan.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TinNhanController],
  providers: [TinNhanService],
})
export class TinNhanModule { }
