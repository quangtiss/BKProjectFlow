import { Injectable } from '@nestjs/common';
import { CreateThongBaoDto } from './dto/create_thong_bao.dto';
import { UpdateThongBaoDto } from './dto/update_thong_bao.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ThongBaoService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async getCountAll(user) {
    const result = {
      de_tai_chua_chap_nhan: 0,
      de_tai_chua_duyet: 0
    }
    if (user.role === "Sinh viên") {
      result.de_tai_chua_chap_nhan = await this.prismaService.dang_ky.count({
        where: {
          id_sinh_vien: user.sub,
          trang_thai: "Chưa chấp nhận"
        }
      })
    } else if (user.role === "Giảng viên") {
      result.de_tai_chua_chap_nhan = await this.prismaService.huong_dan.count({
        where: {
          id_giang_vien: user.sub,
          trang_thai: "Chưa chấp nhận"
        }
      })
    } else if (user.role === "Giảng viên trưởng bộ môn") {
      result.de_tai_chua_chap_nhan = await this.prismaService.huong_dan.count({
        where: {
          id_giang_vien: user.sub,
          trang_thai: "Chưa chấp nhận"
        }
      })
      const giangVienTruongBoMon = await this.prismaService.giang_vien.findUnique({ where: { id_tai_khoan: user.sub } })
      result.de_tai_chua_duyet = await this.prismaService.de_tai.count({
        where: {
          trang_thai: "GVHD đã chấp nhận",
          trang_thai_duyet: "Chưa duyệt",
          huong_dan: {
            some: {
              giang_vien: {
                to_chuyen_nganh: giangVienTruongBoMon?.to_chuyen_nganh
              }
            }
          }
        },
      })
    }
    return result
  }

  async create(createThongBaoDto?: CreateThongBaoDto) {
    return "This action return thongBao created"
  }

  findAll() {
    return `This action returns all thongBao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thongBao`;
  }

  update(id: number, updateThongBaoDto: UpdateThongBaoDto) {
    return `This action updates a #${id} thongBao`;
  }

  remove(id: number) {
    return `This action removes a #${id} thongBao`;
  }
}
