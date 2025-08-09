import { forwardRef, Module } from '@nestjs/common';
import { DangKiService } from './dang_ky.service';
import { DangKiController } from './dang_ky.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { DeTaiModule } from '../de_tai/de_tai.module';

@Module({
  imports: [PrismaModule, forwardRef(() => DeTaiModule)],
  controllers: [DangKiController],
  providers: [DangKiService],
  exports: [DangKiService]
})
export class DangKiModule { }
