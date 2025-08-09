import { Module } from '@nestjs/common';
import { TuongTacService } from './tuong_tac.service';
import { TuongTacController } from './tuong_tac.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TuongTacController],
  providers: [TuongTacService],
  exports: [TuongTacService]
})
export class TuongTacModule { }
