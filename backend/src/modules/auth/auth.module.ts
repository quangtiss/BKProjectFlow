import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TaiKhoanModule } from '../tai_khoan/tai_khoan.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './guard/constants';
import { SinhVienModule } from '../sinh_vien/sinh_vien.module';
import { GiaoVuModule } from '../giao_vu/giao_vu.module';
import { GiangVienModule } from '../giang_vien/giang_vien.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    TaiKhoanModule,
    SinhVienModule,
    GiangVienModule,
    GiaoVuModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '45m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
