import { TaiKhoanService } from "../tai_khoan/tai_khoan.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { SinhVienService } from "../sinh_vien/sinh_vien.service";
import { GiangVienService } from "../giang_vien/giang_vien.service";
import { GiaoVuService } from "../giao_vu/giao_vu.service";

@Injectable()
export class AuthService {
  constructor(
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
    if (tai_khoan?.mat_khau !== mat_khau) {
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
    const {
      mssv,
      nam_dao_tao,
      he_dao_tao,
      nganh,
      ngon_ngu,
      msgv,
      to_chuyen_nganh,
      msnv,
      chuc_vu,
      ...dataTaiKhoan
    } = data;

    // 1. Check theo vai trò
    switch (dataTaiKhoan.vai_tro) {
      case "Sinh viên":
        const sinh_vien = await this.sinhVienService.findByMaSo(mssv);
        if (sinh_vien) throw new Error("MSSV đã tồn tại");
        break;

      case "Giáo vụ":
        const giao_vu = await this.giaoVuService.findByMaSo(msnv);
        if (giao_vu) throw new Error("MSNV đã tồn tại");
        break;

      case "Giảng viên":
        const giang_vien = await this.giangVienService.findByMaSo(msgv);
        if (giang_vien) throw new Error("MSGV đã tồn tại");
        break;

      case "Giảng viên trưởng bộ môn":
        const giang_vien_truong_bo_mon = await this.giangVienService.findByMaSo(msgv);
        if (giang_vien_truong_bo_mon) throw new Error("MSGV đã tồn tại");
        break;
    }

    const taiKhoan = await this.taiKhoanService.create(dataTaiKhoan);
    if (dataTaiKhoan.vai_tro === "Sinh viên") {
      const dataSinhVien = {
        mssv,
        nam_dao_tao,
        he_dao_tao,
        nganh,
        ngon_ngu,
        id_tai_khoan: taiKhoan.id,
      };
      return await this.sinhVienService.create(dataSinhVien);
    }
    else if (dataTaiKhoan.vai_tro === "Giáo vụ") {
      const dataGiaoVu = {
        msnv,
        chuc_vu,
        id_tai_khoan: taiKhoan.id,
      };
      return await this.giaoVuService.create(dataGiaoVu);
    }
    else {
      const dataGiangVien = {
        msgv,
        to_chuyen_nganh,
        is_giang_vien_truong_bo_mon: dataTaiKhoan.vai_tro === "Giảng viên trưởng bộ môn",
        id_tai_khoan: taiKhoan.id,
      };
      return await this.giangVienService.create(dataGiangVien);
    }
  }

  async getProfile(user) {
    const tai_khoan = await this.taiKhoanService.findById(user.sub);
    return {
      auth: user,
      tai_khoan: tai_khoan,
    };
  }
}
