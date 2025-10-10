import { forwardRef, Module } from '@nestjs/common';
import { HuongDanService } from './huong_dan.service';
import { HuongDanController } from './huong_dan.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { DeTaiModule } from '../de_tai/de_tai.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, forwardRef(() => DeTaiModule), NotificationsModule],
  controllers: [HuongDanController],
  providers: [HuongDanService],
  exports: [HuongDanService]
})
export class HuongDanModule { }
