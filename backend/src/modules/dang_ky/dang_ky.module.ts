import { forwardRef, Module } from '@nestjs/common';
import { DangKiService } from './dang_ky.service';
import { DangKiController } from './dang_ky.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { DeTaiModule } from '../de_tai/de_tai.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, forwardRef(() => DeTaiModule), NotificationsModule],
  controllers: [DangKiController],
  providers: [DangKiService],
  exports: [DangKiService]
})
export class DangKiModule { }
