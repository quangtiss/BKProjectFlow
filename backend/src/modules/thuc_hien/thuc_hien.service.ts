import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Buffer } from "buffer";


@Injectable()
export class ThucHienService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return await this.prismaService.thuc_hien.findMany();
    }


    async findByIdNhiemVu(id: number) {
        return await this.prismaService.thuc_hien.findMany({
            where: { id_nhiem_vu: id },
            include: {
                sinh_vien: {
                    include: {
                        tai_khoan: true
                    }
                },
                tai_lieu: true
            }
        });
    }

    async findById(id: number) {
        return await this.prismaService.thuc_hien.findUnique({
            where: { id },
            include: {
                sinh_vien: {
                    include: {
                        tai_khoan: true
                    }
                },
                tai_lieu: true
            }
        });
    }

    isStart(nhiemVu) {
        if (!nhiemVu?.ngay_bat_dau) return false  // chưa có ngày bắt đầu thì mặc định false
        const start = new Date(nhiemVu.ngay_bat_dau).getTime()
        const now = Date.now()
        return now >= start

    }
    isEnd(nhiemVu) {
        if (!nhiemVu?.ngay_ket_thuc) return false
        const due = new Date(nhiemVu.ngay_ket_thuc).getTime()
        const now = Date.now()
        return now >= due

    }

    async create(data: any, user: any, files: any) {
        try {
            const nhiemVu = await this.prismaService.nhiem_vu.findFirst({
                where: {
                    id: data.idNhiemVu,
                    id_de_tai: data.idDeTai
                }
            })
            if (!nhiemVu) throw new NotFoundException("Không thể tìm thấy nhiệm vụ")
            const dangKy = await this.prismaService.dang_ky.findFirst({
                where: {
                    id_de_tai: data.idDeTai,
                    id_sinh_vien: user.sub,
                    trang_thai: "Đã chấp nhận"
                }
            })
            if (!dangKy) throw new NotFoundException("Không tìm thấy sinh viên thuộc đề tài")
            if (!this.isStart(nhiemVu)) throw new BadRequestException("Nhiệm vụ chưa bắt đầu")
            if (this.isEnd(nhiemVu)) throw new BadRequestException("Nhiệm vụ đã kết thúc")


            //BUSINESS


            return await this.prismaService.$transaction(async (tx) => {
                const thucHien = await tx.thuc_hien.create({
                    data: {
                        trang_thai: "Đã gửi",
                        noi_dung: data.noi_dung,
                        ngay_thuc_hien: new Date(),
                        id_sinh_vien: user.sub,
                        id_nhiem_vu: data.idNhiemVu
                    }
                })

                if (files?.length) {
                    const relativePath = path.join(
                        'uploads', 'nhiem_vu', 'sinh_vien_submit',
                        "de_tai_" + String(data.idDeTai),
                        "nhiem_vu_" + String(nhiemVu.id),
                        "sinh_vien_" + String(user.sub)
                    )
                    const uploadRoot = path.join(process.cwd(), relativePath)
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
                                const tepDinhKem = await tx.tai_lieu.create({
                                    data: {
                                        ten_tai_lieu: originalName,
                                        url: relativePath,
                                        id_thuc_hien: thucHien.id,
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
            })
        } finally {
            if (files?.length) {
                const tempDir = path.dirname(files[0].path);
                await fs.rm(tempDir, { recursive: true, force: true });
            }
        }
    }

    async update(id: number, data: any, newFiles, oldFileDeleted, user) {
        try {
            const thucHien = await this.prismaService.thuc_hien.findUnique({
                where: { id },
                include: {
                    nhiem_vu: true
                }
            })
            if (!thucHien) throw new NotFoundException("Không thể tìm thấy bài làm khớp với yêu cầu")
            if (thucHien.id_sinh_vien !== user.sub) throw new ForbiddenException("Bạn không có quyền chỉnh sửa bài làm này")
            if (!this.isStart(thucHien.nhiem_vu)) throw new BadRequestException("Nhiệm vụ chưa bắt đầu")
            if (this.isEnd(thucHien.nhiem_vu)) throw new BadRequestException("Nhiệm vụ đã kết thúc")

            //BUSINESS

            return await this.prismaService.$transaction(async (tx) => {
                const thucHienUpdated = await tx.thuc_hien.update({
                    where: { id },
                    data: {
                        trang_thai: "Đã gửi",
                        noi_dung: data.noi_dung,
                        ngay_chinh_sua: new Date()
                    }
                })
                if (oldFileDeleted.length) {
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
                        'uploads', 'nhiem_vu', 'sinh_vien_submit',
                        "de_tai_" + String(data.idDeTai),
                        "nhiem_vu_" + String(thucHienUpdated.id_nhiem_vu),
                        "sinh_vien_" + String(user.sub)
                    )
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
                                const tepDinhKem = await tx.tai_lieu.create({
                                    data: {
                                        ten_tai_lieu: originalName,
                                        url: relativePath,
                                        id_thuc_hien: thucHienUpdated.id,
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
                return thucHienUpdated;
            })
        } finally {
            if (newFiles?.length) {
                const tempDir = path.dirname(newFiles[0].path);
                await fs.rm(tempDir, { recursive: true, force: true });
            }
        }
    }

    async delete(id: number, user: any) {
        const thucHien = await this.prismaService.thuc_hien.findUnique({
            where: { id },
            include: { nhiem_vu: true }
        })
        if (!thucHien) throw new NotFoundException("Không tìm thấy bài làm")
        if (thucHien.id_sinh_vien !== user.sub) throw new ForbiddenException("Bạn không có quyền xóa bài làm này")

        const thucHienDeleted = await this.prismaService.$transaction(async (tx) => {
            await tx.tai_lieu.deleteMany({
                where: { id_thuc_hien: id }
            })
            return await tx.thuc_hien.delete({ where: { id } })
        })
        const relativePath = path.join(
            'uploads',
            'nhiem_vu',
            'sinh_vien_submit',
            "de_tai_" + String(thucHien?.nhiem_vu?.id_de_tai),
            "nhiem_vu_" + String(thucHienDeleted.id_nhiem_vu),
            "sinh_vien_" + String(thucHienDeleted.id_sinh_vien)
        )
        const folderOfThucHien = path.join(
            process.cwd(),
            relativePath
        );
        await fs.rm(folderOfThucHien, { recursive: true, force: true });
        return thucHienDeleted;
    }


    async updateStatus(idThucHien: number, data: any, idGiangVien: number) {
        const thucHien = await this.prismaService.thuc_hien.findUnique({
            where: { id: idThucHien },
            include: { nhiem_vu: true }
        })
        if (!thucHien) throw new NotFoundException("Không tìm thấy bài làm")
        if (thucHien.nhiem_vu?.id_nguoi_them !== idGiangVien) throw new ForbiddenException('Bạn không có quyền')

        //

        return await this.prismaService.thuc_hien.update({
            where: { id: idThucHien },
            data: { trang_thai: data.trang_thai }
        })
    }
}
