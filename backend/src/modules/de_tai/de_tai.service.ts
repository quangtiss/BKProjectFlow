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
            where: query
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
                id_giang_vien_de_xuat: user.role === "Giảng viên" ? user.sub : null,
            }
        })
        await this.huongDanService.create({
            vai_tro: "Giảng viên hướng dẫn chính",
            id_giang_vien: id_giang_vien_huong_dan,
            id_de_tai: deTai.id,
            trang_thai: "Chưa chấp nhận",
        })
        if (user.role === "Sinh viên") {
            const dangKi = await this.dangKiService.create({
                ngay_dang_ki: new Date(),
                id_sinh_vien: user.sub,
                id_de_tai: deTai.id
            })
            return {
                de_tai: deTai,
                dang_ki: dangKi
            }
        }
        return deTai;
    }

    async update(id: number, data: any) {
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
