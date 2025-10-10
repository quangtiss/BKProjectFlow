import { forwardRef, Module } from '@nestjs/common';
import { DuyetDeTaiController } from './duyet_de_tai.controller';
import { DuyetDeTaiService } from './duyet_de_tai.service';
import { PrismaModule } from 'prisma/prisma.module';
import { DeTaiModule } from '../de_tai/de_tai.module';
import { UtilsModule } from '../a_utils/utils.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => DeTaiModule),
    UtilsModule,
    NotificationsModule
  ],
  controllers: [DuyetDeTaiController],
  providers: [DuyetDeTaiService],
  exports: [DuyetDeTaiService]
})
export class DuyetDeTaiModule { }
