import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UtilsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }


  async getFile(id, res) {
    let file: any = await this.prismaService.tai_lieu.findUnique({
      where: { id }
    })
    if (!file) {
      file = await this.prismaService.tep_dinh_kem.findUnique({
        where: { id }
      })
      if (!file) throw new NotFoundException("Không tìm thấy file")
    }
    const safeFileName = encodeURIComponent(file?.ten_tai_lieu || "");
    res.setHeader(
      'Content-Disposition',
      `inline; filename*=UTF-8''${safeFileName}`
    );
    const filePath = join(process.cwd(), file?.url || "", file?.ten_tai_lieu || "");
    return res.sendFile(filePath);
  }


  async generateTopicFromDescription(bodyData: { mo_ta: string }, idDeTai: number) {
    const listChuDe = await this.prismaService.chu_de.findMany()
    const moTa = bodyData.mo_ta
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-flash-1.5",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": `Đây là list chủ đề ${JSON.stringify(listChuDe)}, đây là tên tiếng anh, tiếng việt và mô tả của đề tài: ${moTa}
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
  }

}
