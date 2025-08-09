import { ConflictException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DeTaiService } from '../de_tai/de_tai.service';

@Injectable()
export class DangKiService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => DeTaiService))
        private readonly deTaiService: DeTaiService
    ) { }

    async findAll(query: object) {
        return await this.prismaService.dang_ky.findMany({
            where: query,
            include: {
                de_tai: {
                    include: {
                        tai_khoan: {
                            include: {
                                sinh_vien: true,
                                giang_vien: true,
                                giao_vu: true,
                            }
                        }
                    }
                }
            }
        });
    }


    async findByCurrentSinhVien(id: number, query: object) {
        return await this.prismaService.dang_ky.findMany({
            where: {
                id_sinh_vien: id,
                ...query
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
                        duyet_de_tai: {
                            include: {
                                giang_vien_truong_bo_mon: {
                                    include: {
                                        tai_khoan: true
                                    }
                                }
                            }
                        }
                    },
                }
            }
        });
    }

    async findByIdDeTai(idDeTai: number, query: object) {
        return await this.prismaService.dang_ky.findMany({
            where: {
                id_de_tai: idDeTai,
                ...query
            },
            include: {
                sinh_vien: {
                    include: {
                        tai_khoan: true
                    }
                }
            }
        })
    }

    async rejectOtherAcceptedDangKy(idSinhVien: number, tx: Prisma.TransactionClient) {
        const DangKyChapNhanBefore = await tx.dang_ky.findMany({
            where: {
                id_sinh_vien: idSinhVien,
                trang_thai: "Đã chấp nhận"
            }
        })
        if (DangKyChapNhanBefore.length > 0) {
            await Promise.all(
                DangKyChapNhanBefore.flatMap((dangKy) =>
                    [
                        tx.dang_ky.update({
                            where: { id: dangKy.id },
                            data: {
                                trang_thai: "Đã từ chối"
                            }
                        }),
                        this.deTaiService.update(
                            dangKy.id_de_tai || 0,
                            {
                                so_sinh_vien_dang_ky: {
                                    increment: -1
                                }
                            }
                            , tx)
                    ]
                )
            )
        }
    }

    async checkSinhVienDangKyHaveEnoughCondition(idSinhVien: number, idDeTai: number, tx: Prisma.TransactionClient) {
        const deTai = await this.deTaiService.findById(idDeTai, tx)
        if (!deTai || typeof deTai?.so_luong_sinh_vien !== 'number' || typeof deTai?.so_sinh_vien_dang_ky !== 'number') throw new NotFoundException('Không tìm thấy đề tài')
        if (deTai.so_sinh_vien_dang_ky >= deTai.so_luong_sinh_vien) {
            throw new ConflictException("Số lượng sinh viên đăng ký đề tài đã đầy");
        }
        const sinhVienDangKy = await tx.sinh_vien.findUnique({ where: { id_tai_khoan: idSinhVien } })
        const lisSinhVienDaThamGia = await tx.dang_ky.findMany({
            where: {
                id_de_tai: idDeTai,
                trang_thai: "Đã chấp nhận"
            },
            include: {
                sinh_vien: true
            }
        })
        if (!sinhVienDangKy) throw new NotFoundException('Không tìm thấy sinh viên')
        if (deTai.nhom_nganh !== 'Liên ngành CS-CE' && sinhVienDangKy.nganh !== deTai.nhom_nganh)
            throw new ConflictException("Sinh viên không thuộc cùng nhóm ngành của đề tài")
        if (
            deTai.he_dao_tao !== sinhVienDangKy.ngon_ngu
        ) throw new ConflictException("Sinh viên không phù hợp với hệ đào tạo đã đăng ký")
        const groups = new Set(
            lisSinhVienDaThamGia.map((sv) => {
                if (deTai.nhom_nganh !== 'Liên ngành CS-CE' && sv?.sinh_vien?.nganh !== deTai.nhom_nganh)
                    throw new ConflictException("Danh sách sinh viên không phù hợp với nhóm ngành đã đăng ký")
                if (sv?.sinh_vien?.he_dao_tao === 'Chất lượng cao tăng cường tiếng Nhật') return 'CN';
                if (sv?.sinh_vien?.he_dao_tao === 'Chất lượng cao') return 'CC';
                return 'OTHER';
            })
        );
        if (
            deTai.he_dao_tao === "Tiếng Việt" && groups.has("CC") ||
            deTai.he_dao_tao === "Tiếng Anh" && (groups.has("CN") || groups.has("OTHER"))
        ) throw new ConflictException("Danh sách sinh viên không phù hợp với hệ đào tạo đã đăng ký")

        if (groups.size > 1) {
            throw new ConflictException('Chỉ được làm chung đề tài nếu cùng nhóm được khoa quy định');
        }

        if (groups.size === 1) {
            if (
                groups.has("CC") && sinhVienDangKy.he_dao_tao !== 'Chất lượng cao' ||
                groups.has('CN') && sinhVienDangKy.he_dao_tao !== 'Chất lượng cao tăng cường tiếng Nhật' ||
                groups.has('OTHER') && (sinhVienDangKy.he_dao_tao === 'Chất lượng cao tăng cường tiếng Nhật' || sinhVienDangKy.he_dao_tao === 'Chất lượng cao')
            ) throw new ConflictException('Sinh viên không nằm trong cùng nhóm hệ đào tạo được làm chung')
        }

    }

    async create(data: any, tx?: Prisma.TransactionClient) {
        if (tx) {
            // Đã có transaction → dùng luôn
            await this.checkSinhVienDangKyHaveEnoughCondition(data.id_sinh_vien, data.id_de_tai, tx)
            if (data.trang_thai === "Đã chấp nhận") {
                await this.rejectOtherAcceptedDangKy(data.id_sinh_vien, tx);
                await this.deTaiService.update(
                    data.id_de_tai,
                    {
                        so_sinh_vien_dang_ky: {
                            increment: 1
                        }
                    },
                    tx
                )
            }
            return await tx.dang_ky.create({
                data: {
                    ...data,
                    ngay_dang_ky: new Date()
                }
            });
        } else {
            // Chưa có transaction → mở transaction mới
            return this.prismaService.$transaction(async (tx) => {
                await this.checkSinhVienDangKyHaveEnoughCondition(data.id_sinh_vien, data.id_de_tai, tx)
                if (data.trang_thai === "Đã chấp nhận") {
                    await this.rejectOtherAcceptedDangKy(data.id_sinh_vien, tx);
                    await this.deTaiService.update(
                        data.id_de_tai,
                        {
                            so_sinh_vien_dang_ky: {
                                increment: 1
                            }
                        },
                        tx
                    )
                }
                return await tx.dang_ky.create({
                    data: {
                        ...data,
                        ngay_dang_ky: new Date()
                    }
                });
            });
        }
    }

    async update(id: number, data: any, idSinhVien: number) {
        if (!data || Object.keys(data).length === 0) {
            // Không có gì để cập nhật
            return null;
        }
        return this.prismaService.$transaction(async (tx) => {
            const dangKy = await tx.dang_ky.findUnique({
                where: { id }
            })
            if (dangKy?.id_sinh_vien !== idSinhVien) {
                throw new ForbiddenException("Bạn không có quyền")
            }
            if (data.trang_thai === "Đã chấp nhận") {
                if (!dangKy?.id_de_tai) {
                    throw new NotFoundException("Không tìm thấy đề tài liên quan");
                }
                const deTai = await this.deTaiService.findById(dangKy.id_de_tai, tx)
                if (typeof deTai?.so_luong_sinh_vien === 'number' && typeof deTai?.so_sinh_vien_dang_ky === 'number' && (deTai.so_luong_sinh_vien > deTai.so_sinh_vien_dang_ky)) {
                    await this.deTaiService.update(
                        dangKy.id_de_tai,
                        {
                            so_sinh_vien_dang_ky: {
                                increment: 1
                            }
                        },
                        tx
                    )
                }
                else {
                    throw new ConflictException("Số lượng sinh viên đăng ký đã đầy")
                }
                await this.rejectOtherAcceptedDangKy(idSinhVien, tx)
            }
            await tx.dang_ky.update({
                where: { id },
                data: data
            })
        })
    }

    async delete(id: number) {
        return this.prismaService.dang_ky.delete({
            where: { id }
        })
    }
}
