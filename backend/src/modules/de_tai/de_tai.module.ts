import { forwardRef, Module } from '@nestjs/common';
import { DeTaiController } from './de_tai.controller';
import { DeTaiService } from './de_tai.service';
import { PrismaModule } from 'prisma/prisma.module';
import { DangKiModule } from '../dang_ky/dang_ky.module';
import { HuongDanModule } from '../huong_dan/huong_dan.module';
import { ThongBaoModule } from '../thong_bao/thong_bao.module';
import { TuongTacModule } from '../tuong_tac/tuong_tac.module';
import { GiangVienModule } from '../giang_vien/giang_vien.module';
import { SinhVienModule } from '../sinh_vien/sinh_vien.module';
import { DuyetDeTaiModule } from '../duyet_de_tai/duyet_de_tai.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    SinhVienModule,
    GiangVienModule,
    forwardRef(() => DangKiModule),
    forwardRef(() => HuongDanModule),
    forwardRef(() => DuyetDeTaiModule),
    ThongBaoModule,
    TuongTacModule,
    NotificationsModule
  ],
  controllers: [DeTaiController],
  providers: [DeTaiService],
  exports: [DeTaiService]
})
export class DeTaiModule { }
