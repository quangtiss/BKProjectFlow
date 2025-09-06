import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { TaiKhoanModule } from './modules/tai_khoan/tai_khoan.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { RolesGuard } from './modules/auth/guard/roles.guard';
import { HocKyModule } from './modules/hoc_ky/hoc_ky.module';
import { DeTaiModule } from './modules/de_tai/de_tai.module';
import { ChamDiemModule } from './modules/cham_diem/cham_diem.module';
import { ChuDeModule } from './modules/chu_de/chu_de.module';
import { DangKiModule } from './modules/dang_ky/dang_ky.module';
import { DuyetDeTaiModule } from './modules/duyet_de_tai/duyet_de_tai.module';
import { GiangVienModule } from './modules/giang_vien/giang_vien.module';
import { GiaoVuModule } from './modules/giao_vu/giao_vu.module';
import { HoiDongModule } from './modules/hoi_dong/hoi_dong.module';
import { ChinhSuaModule } from './modules/chinh_sua/chinh_sua.module';
import { HuongDanModule } from './modules/huong_dan/huong_dan.module';
import { KetQuaModule } from './modules/ket_qua/ket_qua.module';
import { LichTrinhModule } from './modules/lich_trinh/lich_trinh.module';
import { MauDanhGiaModule } from './modules/mau_danh_gia/mau_danh_gia.module';
import { MoiLienQuanModule } from './modules/moi_lien_quan/moi_lien_quan.module';
import { MoiQuanTamModule } from './modules/moi_quan_tam/moi_quan_tam.module';
import { NhiemVuModule } from './modules/nhiem_vu/nhiem_vu.module';
import { SinhVienModule } from './modules/sinh_vien/sinh_vien.module';
import { TaiLieuModule } from './modules/tai_lieu/tai_lieu.module';
import { ThamGiaModule } from './modules/tham_gia/tham_gia.module';
import { ThucHienModule } from './modules/thuc_hien/thuc_hien.module';
import { TieuChiModule } from './modules/tieu_chi/tieu_chi.module';
import { TinNhanModule } from './modules/tin_nhan/tin_nhan.module';
import { ThongBaoModule } from './modules/thong_bao/thong_bao.module';
import { TuongTacModule } from './modules/tuong_tac/tuong_tac.module';
import { UtilsModule } from './modules/a_utils/utils.module';
import { ChatGateway } from './modules/tin_nhan/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // rất quan trọng để có thể dùng process.env ở mọi nơi
    }),
    AuthModule,
    ChamDiemModule,
    ChinhSuaModule,
    ChuDeModule,
    DangKiModule,
    DeTaiModule,
    DuyetDeTaiModule,
    GiangVienModule,
    GiaoVuModule,
    HocKyModule,
    HoiDongModule,
    HuongDanModule,
    KetQuaModule,
    LichTrinhModule,
    MauDanhGiaModule,
    MoiLienQuanModule,
    MoiQuanTamModule,
    NhiemVuModule,
    SinhVienModule,
    TaiKhoanModule,
    TaiLieuModule,
    ThamGiaModule,
    ThucHienModule,
    TieuChiModule,
    TinNhanModule,
    ThongBaoModule,
    TuongTacModule,
    UtilsModule,
    ChatGateway
  ],
  controllers: [AppController],
  providers: [ // Áp dụng global cho kiểm soát yêu cầu đăng nhập Auth và quản lý Role nào được dùng api nào
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    ChatGateway
  ],
})
export class AppModule { }
