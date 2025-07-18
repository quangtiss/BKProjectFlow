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
import { LogInDTO } from "./dto/login.dto";
import { SignUpDTO } from "./dto/signup.dto";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { Public } from "./guard/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async LogIn(
    @Body() logInDto: LogInDTO,
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
  SignUp(@Body() data: SignUpDTO) {
    return this.authService.SignUp(data)
  }

  @Get("profile")
  async getProfile(@Request() req) {
    const user = req.user;
    return this.authService.getProfile(user);
  }
}
