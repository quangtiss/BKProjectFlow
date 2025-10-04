import { TaiKhoanService } from "../tai_khoan/tai_khoan.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { SinhVienService } from "../sinh_vien/sinh_vien.service";
import { GiangVienService } from "../giang_vien/giang_vien.service";
import { GiaoVuService } from "../giao_vu/giao_vu.service";
import { ChangePasswordDTO } from "./dto/signup.dto";
import * as argon2 from "argon2";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private taiKhoanService: TaiKhoanService,
    private sinhVienService: SinhVienService,
    private giangVienService: GiangVienService,
    private giaoVuService: GiaoVuService,
    private jwtService: JwtService
  ) { }

  async LogIn(
    ten_tai_khoan: string,
    mat_khau: string,
    res: Response
  ): Promise<any> {
    const tai_khoan = await this.taiKhoanService.findOne(ten_tai_khoan);
    if (!tai_khoan || !tai_khoan?.mat_khau) throw new UnauthorizedException();
    const isMatch = await argon2.verify(tai_khoan?.mat_khau!, mat_khau)
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: tai_khoan.id,
      username: tai_khoan.ten_tai_khoan,
      role: tai_khoan.vai_tro,
    };
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

  async changPassword(id: number, data: ChangePasswordDTO) {
    const hashed = await argon2.hash(data.mat_khau);
    return await this.prismaService.tai_khoan.update({
      where: { id: id },
      data: { mat_khau: hashed }
    })
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

  async getProfile(user) {
    const tai_khoan = await this.taiKhoanService.findById(user.sub);
    return {
      auth: user,
      tai_khoan: tai_khoan,
    };
  }
}
