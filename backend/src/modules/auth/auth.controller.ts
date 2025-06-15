import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { Public } from "./guard/public.decorator";
import { Roles } from "./guard/roles.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async LogIn(
    @Body() logInDto: Record<string, any>,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.LogIn(
      logInDto.ten_tai_khoan,
      logInDto.mat_khau,
      res
    );
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  LogOut(@Res({ passthrough: true }) res: Response) {
    return this.authService.LogOut(res);
  }


  @Public()
  @Post("signup")
  SignUp(@Body() data) {
    return this.authService.SignUp(data)
  }

  @Roles("Sinh viên")
  @Get("profile")
  async getProfile(@Request() req) {
    return this.authService.getProfile(req);
  }
}
