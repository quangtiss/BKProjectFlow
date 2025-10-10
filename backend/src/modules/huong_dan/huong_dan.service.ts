import { NotificationsService } from './../notifications/notifications.service';
import { Injectable, forwardRef, Inject, Query } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DeTaiService } from '../de_tai/de_tai.service';
import { Prisma } from '@prisma/client';
import { QueryHuongDanDTO } from './dto/query_huong_dan.dto';

@Injectable()
export class HuongDanService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => DeTaiService))
        private readonly deTaiService: DeTaiService,
        private readonly notificationsService: NotificationsService
    ) { }

    async findAll() {
        return await this.prismaService.huong_dan.findMany();
    }


    async findByCurrentIdGiangVien(idGiangVien: number, query: QueryHuongDanDTO) {
        return this.prismaService.huong_dan.findMany({
            where: {
                trang_thai: query?.trang_thai,
                de_tai: {
                    thuoc_ve: {
                        some: {
                            id_hoc_ky: +query?.id_hoc_ky || undefined,
                        }
                    }
                },
                id_giang_vien: idGiangVien
            },
            include: {
                de_tai: {
                    include: {
                        tai_khoan: {
                            include: {
                                sinh_vien: true,
                                giang_vien: true,
                            }
                        },
                        huong_dan: {
                            where: {
                                trang_thai: "Đã chấp nhận"
                            },
                            include: {
                                giang_vien: {
                                    include: {
                                        tai_khoan: true
                                    }
                                }
                            }
                        },
                        dang_ky: {
                            where: {
                                trang_thai: "Đã chấp nhận"
                            },
                            include: {
                                sinh_vien: {
                                    include: {
                                        tai_khoan: true
                                    }
                                }
                            }
                        },
                        ket_qua: true,
                        cham_diem: {
                            include: {
                                bang_diem: {
                                    include: {
                                        diem_thanh_phan: true
                                    }
                                }
                            }
                        },
                        duyet_de_tai: {
                            include: {
                                giang_vien_truong_bo_mon: {
                                    include: {
                                        tai_khoan: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    async create(data: any, tx?: Prisma.TransactionClient) {
        const client = tx ?? this.prismaService;
        //Thông báo---------------
        if (data.trang_thai === 'Chưa chấp nhận') {
            const deTai = await client.de_tai.findUnique({ where: { id: data.id_de_tai } })
            const tb = await client.thong_bao.create({
                data: {
                    tieu_de: 'Lời mời hướng dẫn đề tài',
                    noi_dung: `Bạn được mời hướng dẫn đề tài ${deTai?.ma_de_tai || 'chưa xác định'}`,
                    duong_dan: '/de-tai-cua-toi'
                }
            })
            const tt = await client.tuong_tac.create({
                data: {
                    id_thong_bao: tb.id,
                    id_nguoi_nhan: data.id_giang_vien,
                    da_doc_chua: false
                }
            })
            this.notificationsService.pushToUser(data.id_giang_vien, { message: 'Bạn có lời mời hướng dẫn đề tài' })
        } else {
            const gvAccepted = await client.giang_vien.findUnique({ where: { id_tai_khoan: data.id_giang_vien } })
            const listGVLead = await client.giang_vien.findMany({
                where: {
                    to_chuyen_nganh: gvAccepted?.to_chuyen_nganh,
                    is_giang_vien_truong_bo_mon: true
                }
            })
            const deTai = await client.de_tai.findUnique({ where: { id: data.id_de_tai } })
            const tb = await client.thong_bao.create({
                data: {
                    tieu_de: 'Đề tài được đề xuất cần duyệt',
                    noi_dung: `Đề tài ${deTai?.ma_de_tai || 'chưa xác định'} đã được đề xuất`,
                    duong_dan: '/duyet-de-tai'
                }
            })
            for (const gvLead of listGVLead) {
                if (gvLead.id_tai_khoan) {
                    const tt = await client.tuong_tac.create({
                        data: {
                            id_thong_bao: tb.id,
                            id_nguoi_nhan: gvLead.id_tai_khoan,
                            da_doc_chua: false
                        }
                    })
                    this.notificationsService.pushToUser(gvLead.id_tai_khoan, { message: 'Có thêm đề tài mới được đề xuất' })
                }
            }
        }
        //-------
        return await client.huong_dan.create(
            { data }
        )
    }

    async findById(id: number, tx?: Prisma.TransactionClient) {
        const client = tx ?? this.prismaService
        return client.huong_dan.findUnique({
            where: { id },
            include: {
                de_tai: {
                    include: {
                        huong_dan: true,
                        dang_ky: true
                    }
                },
                giang_vien: true
            }
        })
    }

    async findByIdDeTai(idDeTai: number, query: object) {
        return this.prismaService.huong_dan.findMany({
            where: {
                id_de_tai: idDeTai,
                ...query
            },
            include: {
                giang_vien: true
            }
        })
    }

    async update(idHuongDan: number, data: any, idUserLoggin: number) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }

        return await this.prismaService.$transaction(async (tx) => {
            const dataCurrentHuongDan = await this.findById(idHuongDan, tx)
            if (dataCurrentHuongDan?.id_giang_vien !== idUserLoggin) throw new Error("Bạn không có quyền!")

            if (!dataCurrentHuongDan?.de_tai?.id) throw new Error("Không tìm thấy id của đề tài thuộc phần quyền của bạn")
            await this.deTaiService.update(dataCurrentHuongDan?.de_tai?.id, {
                trang_thai: data.trang_thai === "Đã chấp nhận" ? "GVHD đã chấp nhận" :
                    data.trang_thai === "Đã từ chối" ? "GVHD đã từ chối" : "GVHD chưa chấp nhận"
            }, tx)

            //Thông báo-------------------

            const tb = await tx.thong_bao.create({
                data: {
                    tieu_de: 'Phản hồi từ giáo viên hướng dẫn',
                    noi_dung: `Giảng viên ${dataCurrentHuongDan.giang_vien?.msgv || 'chưa xác định'} ${data.trang_thai} vai trò ${dataCurrentHuongDan.vai_tro} đề tài ${dataCurrentHuongDan.de_tai.ma_de_tai}`,
                    duong_dan: '/de-tai-cua-toi'
                }
            })
            for (const dangKy of dataCurrentHuongDan.de_tai.dang_ky) {
                if (dangKy.trang_thai === 'Đã chấp nhận' && dangKy.id_sinh_vien) {
                    const tt = await tx.tuong_tac.create({
                        data: {
                            id_thong_bao: tb.id,
                            id_nguoi_nhan: dangKy.id_sinh_vien,
                            da_doc_chua: false
                        }
                    })
                    this.notificationsService.pushToUser(dangKy.id_sinh_vien, { message: 'Giảng viên đã phản hồi lời mời hướng dẫn' })
                }
            }

            for (const huongDan of dataCurrentHuongDan.de_tai.huong_dan) {
                if (huongDan.trang_thai === 'Đã chấp nhận' && huongDan.id_giang_vien) {
                    const tt = await tx.tuong_tac.create({
                        data: {
                            id_thong_bao: tb.id,
                            id_nguoi_nhan: huongDan.id_giang_vien,
                            da_doc_chua: false
                        }
                    })
                    this.notificationsService.pushToUser(huongDan.id_giang_vien, { message: 'Giảng viên đã phản hồi lời mời hướng dẫn' })
                }
            }

            //Báo cho giảng viên trưởng là có đề tài cần duyệt vì GVHD đã chấp nhận rồi
            if (dataCurrentHuongDan.vai_tro === 'Giảng viên hướng dẫn chính' && data.trang_thai === 'Đã chấp nhận') {
                const gvAccepted = await tx.giang_vien.findUnique({ where: { id_tai_khoan: dataCurrentHuongDan.id_giang_vien } })
                const listGVLead = await tx.giang_vien.findMany({
                    where: {
                        to_chuyen_nganh: gvAccepted?.to_chuyen_nganh,
                        is_giang_vien_truong_bo_mon: true
                    }
                })
                const deTai = await tx.de_tai.findUnique({ where: { id: dataCurrentHuongDan.id_de_tai! } })
                const tb = await tx.thong_bao.create({
                    data: {
                        tieu_de: 'Đề tài được đề xuất cần duyệt',
                        noi_dung: `Đề tài ${deTai?.ma_de_tai || 'chưa xác định'} đã được đề xuất`,
                        duong_dan: '/duyet-de-tai'
                    }
                })
                for (const gvLead of listGVLead) {
                    if (gvLead.id_tai_khoan) {
                        const tt = await tx.tuong_tac.create({
                            data: {
                                id_thong_bao: tb.id,
                                id_nguoi_nhan: gvLead.id_tai_khoan,
                                da_doc_chua: false
                            }
                        })
                        this.notificationsService.pushToUser(gvLead.id_tai_khoan, { message: 'Có thêm đề tài mới được đề xuất' })
                    }
                }
            }
            //----------------------


            return await tx.huong_dan.update({
                where: { id: idHuongDan },
                data: data
            })
        })
    }

    async delete(id: number) {
        return this.prismaService.huong_dan.delete({
            where: { id }
        })
    }
}
