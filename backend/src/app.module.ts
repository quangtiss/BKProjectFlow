import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { TaiKhoanModule } from './modules/tai_khoan/TaiKhoan.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { RolesGuard } from './modules/auth/guard/roles.guard';
import { HocKiModule } from './modules/hoc_ki/HocKi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // rất quan trọng để có thể dùng process.env ở mọi nơi
    }),
    TaiKhoanModule,
    AuthModule,
    HocKiModule,
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
  ],
})
export class AppModule { }
