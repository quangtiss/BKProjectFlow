import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './guard/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async LogIn(
    @Body() logInDto: Record<string, any>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.LogIn(
      logInDto.ten_tai_khoan,
      logInDto.mat_khau,
    );
    // ✅ Ghi token vào cookie
    res.cookie('access_token', access_token, {
      httpOnly: true, // Không cho JS truy cập
      secure: false, // Bật = true nếu dùng HTTPS
      sameSite: 'lax', // Giúp ngăn CSRF (hoặc dùng 'strict')
      maxAge: 1000 * 60 * 15, // Hết hạn sau 15 phút
    });
    return {
      message: 'Đăng nhập thành công',
      access_token: access_token
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async LogOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // Phải khớp với lúc set
      sameSite: 'lax',
      path: '/', // Phải đúng path
    });

    return {
      message: 'Đăng xuất thành công',
    };
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
