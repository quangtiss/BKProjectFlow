import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TaiKhoanModule } from '../tai_khoan/tai_khoan.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './guard/constants';

@Module({
  imports: [
    TaiKhoanModule,
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
