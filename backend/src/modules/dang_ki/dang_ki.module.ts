import { Module } from '@nestjs/common';
import { DangKiService } from './dang_ki.service';
import { DangKiController } from './dang_ki.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DangKiController],
  providers: [DangKiService],
})
export class DangKiModule { }
