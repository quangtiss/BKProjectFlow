import { TaiKhoanService } from "./../tai_khoan/TaiKhoan.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private taikhoanService: TaiKhoanService,
    private jwtService: JwtService
  ) { }

  async LogIn(
    ten_tai_khoan: string,
    mat_khau: string,
    res: Response
  ): Promise<any> {
    const tai_khoan = await this.taikhoanService.findOne(ten_tai_khoan);
    if (tai_khoan?.mat_khau !== mat_khau) {
      throw new UnauthorizedException();
    }
    const payload = { sub: tai_khoan.id, username: tai_khoan.ten_tai_khoan, role: tai_khoan.vai_tro };
    const access_token = await this.jwtService.signAsync(payload);
    // ✅ Ghi token vào cookie
    res.cookie("access_token", access_token, {
      httpOnly: true, // Không cho JS truy cập
      secure: false, // Bật = true nếu dùng HTTPS
      sameSite: "lax", // Giúp ngăn CSRF (hoặc dùng 'strict')
      maxAge: 1000 * 60 * 45, // Hết hạn sau 15 phút
    });
    return {
      message: "Đăng nhập thành công",
      access_token: access_token,
    };
  }

  LogOut(res: Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false, // Phải khớp với lúc set
      sameSite: "lax",
      path: "/", // Phải đúng path
    });

    return {
      message: "Đăng xuất thành công",
    };
  }

  async SignUp(data) {
    return await this.taikhoanService.create(data)
  }

  async getProfile(req) {
    //req chứa object user
    const user = req.user;
    const tai_khoan = await this.taikhoanService.findById(user.sub);
    return {
      auth: user,
      tai_khoan: tai_khoan,
    };
  }
}
