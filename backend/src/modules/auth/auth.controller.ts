import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './guard/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  LogIn(@Body() logInDto: Record<string, any>) {
    return this.authService.LogIn(logInDto.ten_tai_khoan, logInDto.mat_khau);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
