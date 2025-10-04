import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Buffer } from "buffer";

@Injectable()
export class NhiemVuService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAllWithIdDeTai(idDeTai: number) {
        return await this.prismaService.nhiem_vu.findMany({
            where: { id_de_tai: idDeTai },
            include: {
                tai_lieu: true,
                thuc_hien: {
                    include: {
                        sinh_vien: {
                            include: { tai_khoan: true }
                        },
                        tai_lieu: true
                    }
                },
                giang_vien: {
                    include: { tai_khoan: true }
                }
            }
        });
    }


    async findById(id: number) {
        return await this.prismaService.nhiem_vu.findUnique({
            where: { id },
            include: {
                tai_lieu: true
            }
        });
    }


    async countByIdDeTai(idDeTai: number) {
        const countNhiemVu = await this.prismaService.nhiem_vu.count({
            where: { id_de_tai: idDeTai }
        })
        const countNhiemVuDid = await this.prismaService.nhiem_vu.count({
            where: {
                id_de_tai: idDeTai,
                thuc_hien: {
                    some: {
                        trang_thai: { in: ['Đã gửi', 'Đã chấp nhận'] } //Có ít nhất một bản ghi con trong quan hệ thuc_hien
                    }
                }
            }
        })
        return {
            so_luong: countNhiemVu,
            da_lam: countNhiemVuDid
        }
    }


    async create(data: any, files, user: any) {
        try {
            const deTai = await this.prismaService.de_tai.findUnique({
                where: {
                    id: data.idDeTai
                },
                include: { duyet_de_tai: true }
            })
            if (!deTai) throw new NotFoundException("Không tìm thấy đề tài")
            if (deTai.duyet_de_tai?.trang_thai !== "Đã chấp nhận") throw new ConflictException("Đề tài chưa được duyệt")
            const huongDan = await this.prismaService.huong_dan.findFirst({
                where: {
                    id_de_tai: data.idDeTai,
                    id_giang_vien: user.sub,
                    trang_thai: "Đã chấp nhận"
                }
            })
            if (!huongDan) throw new NotFoundException("Bạn không có quyền trên đề tài này")

            //Bắt đầu tạo

            return await this.prismaService.$transaction(async (tx) => {
                const nhiemVu = await tx.nhiem_vu.create({
                    data: {
                        ten: data.ten,
                        mo_ta: data.mo_ta,
                        ngay_bat_dau: new Date(data.ngay_bat_dau),
                        ngay_ket_thuc: new Date(data.ngay_ket_thuc),
                        id_nguoi_them: user.sub,
                        id_de_tai: data.idDeTai
                    }
                })
                if (files?.length) {
                    const relativePath = path.join(
                        'uploads',
                        'nhiem_vu',
                        'giang_vien_upload',
                        "de_tai_" + String(data.idDeTai),
                        "nhiem_vu_" + String(nhiemVu.id),
                        "giang_vien_" + String(user.sub))
                    const uploadRoot = path.join(
                        process.cwd(),
                        relativePath
                    );
                    await fs.mkdir(uploadRoot, { recursive: true });
                    const writtenFiles: string[] = [];

                    try {
                        await Promise.all(
                            files.map(async (file) => {
                                // move file
                                const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
                                const destPath = path.join(uploadRoot, originalName);
                                await fs.rename(file.path, destPath);
                                writtenFiles.push(destPath);

                                // insert DB
                                const taiLieu = await tx.tai_lieu.create({
                                    data: {
                                        ten_tai_lieu: originalName,
                                        url: relativePath,
                                        id_nhiem_vu: nhiemVu.id,
                                    },
                                });
                            })
                        );
                    } catch (error) {
                        await Promise.all(
                            writtenFiles.map(async (f) => {
                                try {
                                    await fs.unlink(f);
                                } catch { }
                            })
                        );
                        await Promise.all(
                            files.map(async (file) => {
                                try {
                                    await fs.unlink(file.path); // file.path = đường dẫn trong temp
                                } catch { }
                            })
                        );
                        throw error; // ném lỗi để Prisma rollback DB
                    }
                }
                return nhiemVu;
            });
        } finally {
            if (files?.length) {
                const tempDir = path.dirname(files[0].path);
                await fs.rm(tempDir, { recursive: true, force: true });
            }
        }
    }

    async update(id: number, newFiles, data: any, oldFileDeleted: any, user: any) {
        try {
            const nhiemVu = await this.prismaService.nhiem_vu.findUnique({
                where: {
                    id
                }
            })
            if (!nhiemVu) throw new NotFoundException("Không tìm thấy nhiệm vụ")
            if (nhiemVu.id_nguoi_them !== user.sub) throw new ForbiddenException("Bạn không có quyền chỉnh sửa nhiệm vụ này")


            //BUSINESS

            return await this.prismaService.$transaction(async (tx) => {
                const nhiemVuUpdated = await tx.nhiem_vu.update({
                    where: {
                        id
                    },
                    data: {
                        ten: data.ten,
                        mo_ta: data.mo_ta,
                        ngay_bat_dau: new Date(data.ngay_bat_dau),
                        ngay_ket_thuc: new Date(data.ngay_ket_thuc),
                    }
                })
                if (oldFileDeleted.length > 0) {
                    await Promise.all(
                        oldFileDeleted.map(async (file) => {
                            await tx.tai_lieu.delete({
                                where: {
                                    id: file.id
                                }
                            })
                            const pathFile = path.join(process.cwd(), file.url, file.ten_tai_lieu)
                            await fs.unlink(pathFile)
                        })
                    )
                }
                if (newFiles?.length) {
                    const relativePath = path.join(
                        'uploads',
                        'nhiem_vu',
                        'giang_vien_upload',
                        "de_tai_" + String(nhiemVuUpdated.id_de_tai),
                        "nhiem_vu_" + String(nhiemVuUpdated.id),
                        "giang_vien_" + String(user.sub))
                    const uploadRoot = path.join(
                        process.cwd(),
                        relativePath
                    );
                    await fs.mkdir(uploadRoot, { recursive: true });
                    const writtenFiles: string[] = [];

                    try {
                        await Promise.all(
                            newFiles.map(async (file) => {
                                // move file
                                const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
                                const destPath = path.join(uploadRoot, originalName);
                                await fs.rename(file.path, destPath);
                                writtenFiles.push(destPath);

                                // insert DB
                                const taiLieu = await tx.tai_lieu.create({
                                    data: {
                                        ten_tai_lieu: originalName,
                                        url: relativePath,
                                        id_nhiem_vu: nhiemVuUpdated.id,
                                    },
                                });
                            })
                        );
                    } catch (error) {
                        await Promise.all(
                            writtenFiles.map(async (f) => {
                                try {
                                    await fs.unlink(f);
                                } catch { }
                            })
                        );
                        await Promise.all(
                            newFiles.map(async (file) => {
                                try {
                                    await fs.unlink(file.path); // file.path = đường dẫn trong temp
                                } catch { }
                            })
                        );
                        throw error; // ném lỗi để Prisma rollback DB
                    }
                }
                return nhiemVuUpdated;
            })
        } finally {
            if (newFiles?.length) {
                const tempDir = path.dirname(newFiles[0].path);
                await fs.rm(tempDir, { recursive: true, force: true });
            }
        }
    }

    async delete(id: number, user: any) {
        const nhiemVu = await this.prismaService.nhiem_vu.findUnique({
            where: {
                id
            },
            include: {
                thuc_hien: true
            }
        })
        if (!nhiemVu) throw new NotFoundException("Không tìm thấy nhiệm vụ")
        if (nhiemVu.id_nguoi_them !== user.sub) throw new ForbiddenException("Bạn không có quyền xóa nhiệm vụ này")

        const nhiemVuDeleted = await this.prismaService.$transaction(async (tx) => {
            //Xóa các bài làm 
            if (nhiemVu.thuc_hien.length) {
                await Promise.all(
                    nhiemVu.thuc_hien.map(async (thucHien) => {
                        await tx.tai_lieu.deleteMany({
                            where: { id_thuc_hien: thucHien.id }
                        })
                    })
                )
            }
            await tx.thuc_hien.deleteMany({ where: { id_nhiem_vu: nhiemVu.id } })
            //Xóa nhiệm vụ
            await tx.tai_lieu.deleteMany({ where: { id_nhiem_vu: id } })
            const nhiemVuDeleted = await tx.nhiem_vu.delete({ where: { id: id } })
            return nhiemVuDeleted
        })
        //Xóa các file liên quan đến nhiệm vụ
        const relativePath = path.join(
            'uploads',
            'nhiem_vu',
            'giang_vien_upload',
            "de_tai_" + String(nhiemVuDeleted.id_de_tai),
            "nhiem_vu_" + String(id))
        const folderOfNhiemVu = path.join(
            process.cwd(),
            relativePath
        );
        await fs.rm(folderOfNhiemVu, { recursive: true, force: true });


        //Xóa các file liên quan đến bài làm
        const relativePath_2 = path.join(
            'uploads',
            'nhiem_vu',
            'sinh_vien_submit',
            "de_tai_" + String(nhiemVuDeleted.id_de_tai),
            "nhiem_vu_" + String(nhiemVuDeleted.id)
        )
        const folderOfThucHien = path.join(
            process.cwd(),
            relativePath_2
        );
        await fs.rm(folderOfThucHien, { recursive: true, force: true });
        return nhiemVuDeleted;
    }
}
