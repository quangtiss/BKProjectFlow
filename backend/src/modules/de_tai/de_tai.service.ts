import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DangKiService } from '../dang_ki/dang_ki.service';
import { HuongDanService } from '../huong_dan/huong_dan.service';

@Injectable()
export class DeTaiService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly dangKiService: DangKiService,
        private readonly huongDanService: HuongDanService
    ) { }

    async findAll(query) {
        return await this.prismaService.de_tai.findMany({
            where: query,
            include: {
                huong_dan: true
            }
        });
    }


    async findById(id: number) {
        return await this.prismaService.de_tai.findUnique({
            where: { id },
        });

    }


    async create(data: any, user: any) {
        const { id_giang_vien_huong_dan, ...dataDeTai } = data


        const deTai = await this.prismaService.de_tai.create({
            data: {
                ...dataDeTai,
                ngay_tao: new Date(),
                trang_thai: "Thực hiện",
                trang_thai_duyet: "Chưa chấp nhận",
                giai_doan: "Đồ án chuyên ngành",
                id_tai_khoan_de_xuat: user.sub
            }
        })
        await this.huongDanService.create({
            vai_tro: "Giảng viên hướng dẫn chính",
            id_giang_vien: id_giang_vien_huong_dan,
            id_de_tai: deTai.id,
            trang_thai: "Chưa chấp nhận",
        })
        return deTai;
    }

    async update(id: number | undefined, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.de_tai.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.de_tai.delete({
            where: { id }
        })
    }
}
