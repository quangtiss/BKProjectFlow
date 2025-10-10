import { NotificationsService } from './../notifications/notifications.service';
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
        private readonly utilsService: UtilsService,
        private readonly notificationsService: NotificationsService
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

    async create(duyetDeTai: any, idNguoiDuyet: number) {
        return await this.prismaService.$transaction(async (tx) => {
            const deTai = await tx.de_tai.update({
                where: {
                    id: duyetDeTai.id_de_tai
                },
                data: { trang_thai_duyet: "Đã duyệt" },
                include: {
                    dang_ky: true,
                    huong_dan: true
                }
            })
            if (duyetDeTai.trang_thai === 'Đã chấp nhận') this.utilsService.generateTopicFromDescription({ mo_ta: deTai?.ten_tieng_anh + ". " + deTai?.ten_tieng_viet + ". " + deTai?.mo_ta || "" }, duyetDeTai.id_de_tai)
            const tb = await tx.thong_bao.create({
                data: {
                    tieu_de: 'Đề tài đã được duyệt',
                    noi_dung: `Đề tài ${deTai.ma_de_tai || 'chưa xác định'} ${duyetDeTai.trang_thai}`,
                    duong_dan: '/de-tai-cua-toi'
                }
            })
            for (const dangKy of deTai.dang_ky) {
                if (dangKy.trang_thai === 'Đã chấp nhận' && dangKy.id_sinh_vien) {
                    const tt = await tx.tuong_tac.create({
                        data: {
                            id_thong_bao: tb.id,
                            id_nguoi_nhan: dangKy.id_sinh_vien,
                            da_doc_chua: false
                        }
                    })
                    this.notificationsService.pushToUser(dangKy.id_sinh_vien, { message: 'Đề tài của bạn đã được duyệt, hãy xem kết quả' })
                }
            }

            for (const huongDan of deTai.huong_dan) {
                if (huongDan.trang_thai === 'Đã chấp nhận' && huongDan.id_giang_vien) {
                    const tt = await tx.tuong_tac.create({
                        data: {
                            id_thong_bao: tb.id,
                            id_nguoi_nhan: huongDan.id_giang_vien,
                            da_doc_chua: false
                        }
                    })
                    this.notificationsService.pushToUser(huongDan.id_giang_vien, { message: 'Đề tài của bạn đã được duyệt, hãy xem kết quả' })
                }
            }
            return await tx.duyet_de_tai.create({
                data: {
                    ...duyetDeTai,
                    id_nguoi_duyet: idNguoiDuyet,
                    ngay_duyet: new Date()
                }

            })
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
