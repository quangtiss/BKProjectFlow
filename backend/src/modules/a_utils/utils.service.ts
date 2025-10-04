import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class UtilsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async getHello() {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.API_KEY_AI}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-exp:free",
          "messages": [
            {
              "role": "user",
              "content": [
                {
                  "type": "text",
                  "text": "Chào bạn, hãy nói Hello World xem, sau đó giới thiệu ngắn về bản thâm model của bạn đi"
                }
              ]
            }
          ]
        })
      });
      const data = await response.json()
      if (response.ok) {
        const result = data.choices[0].message.content
        return result;
      }
      else {
        return "Fail to fetch API"
      }
      return data;
    } catch (error) {
      console.error("Lỗi khi gọi AI API:", error);
      return { success: false, message: "Không thể gọi API AI", error: error.message };
    }
  }

  async getInitialData() {
    const countGiangVien = await this.prismaService.giang_vien.count()
    const countSinhVienKhongLamDetai = await this.prismaService.sinh_vien.count({
      where: {
        OR: [
          // Trường hợp 1: không có đăng ký nào
          {
            dang_ky: {
              none: {}
            }
          },
          // Trường hợp 2: có đăng ký nhưng toàn bộ bị từ chối
          {
            AND: [
              {
                dang_ky: {
                  some: {} // có đăng ký
                }
              },
              {
                dang_ky: {
                  every: {
                    trang_thai: { in: ['Đã từ chối', 'Chưa chấp nhận'] }
                  }
                }
              }
            ]
          }
        ]
      }
    })
    const deTaiDangLam = await this.prismaService.de_tai.findMany({
      where: {
        duyet_de_tai: {
          trang_thai: 'Đã chấp nhận'
        },
        trang_thai_duyet: 'Đã duyệt',
        trang_thai: 'GVHD đã chấp nhận'
      }
    })
    const countDeTaiDangLam = deTaiDangLam.length
    const countSlotDangKy = deTaiDangLam.reduce((sum, item) => {
      const slotConLai = (item.so_luong_sinh_vien ?? 0) - (item.so_sinh_vien_dang_ky ?? 0)
      return sum + Math.max(slotConLai, 0)
    }, 0)
    return {
      countSinhVienKhongLamDetai, countGiangVien, countDeTaiDangLam, countSlotDangKy
    }
  }

  async getCurrentAndNextHocKy() {
    const hocKyList = await this.prismaService.hoc_ky.findMany()
    if (!hocKyList) throw new NotFoundException('Không tìm thấy dữ liệu học kỳ của hệ thống')
    const sorted = [...hocKyList]
      .filter(hk => hk.ngay_bat_dau)
      .sort(
        (a, b) => new Date(a.ngay_bat_dau!).getTime() - new Date(b.ngay_bat_dau!).getTime()
      );

    const now = new Date();

    let current;
    let next;

    for (let i = 0; i < sorted.length; i++) {
      const start = new Date(sorted[i].ngay_bat_dau!);

      // Nếu now >= start thì đây có thể là current
      if (now >= start) {
        current = sorted[i];
        // Kiểm tra học kỳ kế tiếp
        if (i + 1 < sorted.length && now < new Date(sorted[i + 1].ngay_bat_dau!)) {
          next = sorted[i + 1];
          break;
        }
      }

      // Nếu now < start thì học kỳ này chính là tiếp theo
      if (now < start) {
        next = sorted[i];
        break;
      }
    }

    return { current, next };
  }


  async getDeTaiRecommend(idSinhVien: number) {
    const rawListIdChuDeQuanTam = await this.prismaService.moi_quan_tam.findMany({
      where: { id_sinh_vien: idSinhVien },
      select: { id_chu_de: true }
    })
    const listIdChuDeQuanTam = rawListIdChuDeQuanTam.map(item => item.id_chu_de)
      .filter((id): id is number => id !== null); // ép thành number[]

    const rawListIdDeTaiLienQuan = await this.prismaService.moi_lien_quan.findMany({
      where: {
        id_chu_de: { in: listIdChuDeQuanTam }
      },
      select: { id_de_tai: true },
    })

    const priorityMap = new Map<number, number>();

    for (const item of rawListIdDeTaiLienQuan) {
      if (!item.id_de_tai) continue;

      // tăng priority mỗi lần gặp
      priorityMap.set(
        item.id_de_tai,
        (priorityMap.get(item.id_de_tai) || 0) + 1
      );
    }

    const listIdDeTaiLienQuan = Array.from(priorityMap.entries())
      .sort((a, b) => b[1] - a[1]) // sắp xếp theo priority
      .map(([id_de_tai]) => id_de_tai); // chỉ lấy id_de_tai

    return listIdDeTaiLienQuan
  }


  async getFile(id, res) {
    const file: any = await this.prismaService.tai_lieu.findUnique({
      where: { id }
    })
    if (!file) throw new NotFoundException("Không tìm thấy tài liệu")
    const safeFileName = encodeURIComponent(file?.ten_tai_lieu);
    res.setHeader(
      'Content-Disposition',
      `inline; filename*=UTF-8''${safeFileName}`
    );
    const filePath = join(process.cwd(), file?.url, file?.ten_tai_lieu);
    return res.sendFile(filePath);
  }


  async generateTopicFromDescription(bodyData: { mo_ta: string }, idDeTai: number) {
    try {
      const listChuDe = await this.prismaService.chu_de.findMany()
      const filteredListChuDe = listChuDe.map(chuDe => ({ id: chuDe.id, ten_chu_de: chuDe.ten_tieng_viet + " " + chuDe.ten_tieng_anh }))
      const moTa = bodyData.mo_ta
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.API_KEY_AI}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-exp:free",
          "messages": [
            {
              "role": "user",
              "content": [
                {
                  "type": "text",
                  "text": `Đây là list chủ đề ${JSON.stringify(filteredListChuDe)}; đây là tên tiếng anh, tiếng việt và mô tả của đề tài: ${moTa}
                Bạn hãy phân tích mô tả sau đó xem nó thuộc các thể loại ten_chu_de nào ở trên, liệt kê thật đầy đủ, hãy liệt kê ra theo dạng chuỗi id của chúng trong array trên, các thành phần không được lặp lại và phải cách nhau dấu , . Bạn phải trả về dạng chuỗi theo yêu cầu và không làm gì hay nói gì thêm.`
                }
              ]
            }
          ]
        })
      });
      const data = await response.json()
      if (response.ok) {
        const result = data.choices[0].message.content
        const listIdTopic = Array.from(
          new Set(
            result
              .split(",")
              .map(s => s.trim())    // bỏ khoảng trắng
              .filter(s => s !== "") // bỏ phần tử rỗng
              .map(Number)           // chuyển thành số
              .filter(n => !isNaN(n))// bỏ NaN
          )
        );
        await Promise.all(
          (listIdTopic || []).map((idTopic) =>
            this.prismaService.moi_lien_quan.create({
              data: {
                id_de_tai: idDeTai,
                id_chu_de: Number(idTopic),
              }
            })
          )
        )
        return result;
      }
      return data;
    } catch (error) {
      console.error("Lỗi khi gọi AI API:", error);
      return { success: false, message: "Không thể gọi API AI", error: error.message };
    }
  }

}
