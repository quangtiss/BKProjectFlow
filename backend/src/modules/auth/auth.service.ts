import { TaiKhoanService } from './../tai_khoan/TaiKhoan.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private taikhoanService: TaiKhoanService,
    private jwtService: JwtService,
  ) {}

  async LogIn(ten_tai_khoan: string, mat_khau: string): Promise<any> {
    const tai_khoan = await this.taikhoanService.findOne(ten_tai_khoan);
    if (tai_khoan?.mat_khau !== mat_khau) {
      throw new UnauthorizedException();
    }
    const payload = { sub: tai_khoan.id, username: tai_khoan.ten_tai_khoan };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
