import { Module } from '@nestjs/common';
import { DangKiService } from './dang_ky.service';
import { DangKiController } from './dang_ky.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DangKiController],
  providers: [DangKiService],
  exports: [DangKiService]
})
export class DangKiModule { }
