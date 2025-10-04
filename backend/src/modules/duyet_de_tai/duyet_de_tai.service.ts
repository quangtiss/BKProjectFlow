import { tai_khoan } from '@prisma/client';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DeTaiService } from '../de_tai/de_tai.service';
import { Prisma } from '@prisma/client';
import { UtilsService } from '../a_utils/utils.service';

@Injectable()
export class DuyetDeTaiService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => DeTaiService))
        private readonly deTaiService: DeTaiService,
        private readonly utilsService: UtilsService
    ) { }

    async findAll(query) {
        return await this.prismaService.duyet_de_tai.findMany({
            where: {
                trang_thai: query?.trang_thai,
                de_tai: {
                    thuoc_ve: {
                        some: {
                            id_hoc_ky: +query?.id_hoc_ky || undefined,
                            trang_thai: 'Đang làm'
                        }
                    },
                    giai_doan: query?.giai_doan
                },
            },
            include: {
                giang_vien_truong_bo_mon: {
                    include: {
                        tai_khoan: true  //Kèm thông tin tài khoản giảng viên trưởng bộ môn duyệt
                    }
                },
                de_tai: {
                    include: {
                        tai_khoan: {
                            include: { // Kèm thông tin người đề xuất
                                sinh_vien: true,
                                giang_vien: true,
                                giao_vu: true,
                            }
                        },
                        huong_dan: {
                            include: {
                                giang_vien: {
                                    include: {
                                        tai_khoan: true  //Kèm thông tin giảng viên chấp nhận hướng dẫn
                                    }
                                }
                            }
                        },
                        dang_ky: {
                            include: {
                                sinh_vien: {
                                    include: {
                                        tai_khoan: true
                                    }
                                }
                            }
                        },
                        danh_gia: {
                            include: {
                                hoi_dong: true
                            }
                        },
                        phan_bien: true
                    }
                },
            }
        });
    }


    async findById(id: number) {
        return await this.prismaService.duyet_de_tai.findUnique({
            where: { id },
        });

    }

    async create(duyetDeTai: any, idNguoiDuyet: number, tx?: Prisma.TransactionClient) {
        const client = tx || this.prismaService
        const deTai = await this.deTaiService.update(duyetDeTai.id_de_tai, { trang_thai_duyet: "Đã duyệt" }, tx)
        if (duyetDeTai.trang_thai === 'Đã chấp nhận') this.utilsService.generateTopicFromDescription({ mo_ta: deTai?.ten_tieng_anh + ". " + deTai?.ten_tieng_viet + ". " + deTai?.mo_ta || "" }, duyetDeTai.id_de_tai)
        return await client.duyet_de_tai.create({
            data: {
                ...duyetDeTai,
                id_nguoi_duyet: idNguoiDuyet,
                ngay_duyet: new Date()
            }

        })
    }

    async update(id: number, data: any) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return await this.prismaService.duyet_de_tai.update({
            where: { id: id },
            data: data
        })
    }

    async delete(id: number) {
        return this.prismaService.duyet_de_tai.delete({
            where: { id }
        })
    }
}
