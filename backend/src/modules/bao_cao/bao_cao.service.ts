import { Injectable, ForbiddenException, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { promises as fs } from 'fs';
import * as path from 'path';
import { Buffer } from "buffer";

@Injectable()
export class BaoCaoService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(data: any, files: any, idSinhVien: number) {
    let relativePath = ""
    let uploadRoot = ""
    try {
      const duyetDeTai = await this.prismaService.duyet_de_tai.findFirst({
        where: {
          id_de_tai: data.idDeTai,
          trang_thai: "Đã chấp nhận"
        }
      })
      if (!duyetDeTai) throw new ConflictException('Đề tài chưa được duyệt')
      const deTai = await this.prismaService.dang_ky.findFirst({
        where: {
          id_sinh_vien: idSinhVien,
          id_de_tai: data.idDeTai,
          trang_thai: "Đã chấp nhận",
        },
      });
      if (!deTai) throw new ForbiddenException("Bạn không có quyền với đề tài");

      //BUSINESS


      const baoCao = await this.prismaService.$transaction(async (tx) => {
        const baoCao = await tx.bao_cao.create({
          data: {
            trang_thai: "Đã gửi",
            id_sinh_vien: idSinhVien,
            id_de_tai: data.idDeTai,
            noi_dung: data.noi_dung,
            ngay_thuc_hien: new Date()
          }
        })
        if (files.length) {
          relativePath = path.join(
            'uploads',
            'bao_cao',
            "de_tai_" + String(data.idDeTai),
            "bao_cao_" + String(baoCao.id),
            "sinh_vien_" + String(idSinhVien))
          uploadRoot = path.join(
            process.cwd(),
            relativePath
          );
          await fs.mkdir(uploadRoot, { recursive: true });
        }
        await Promise.all(
          files.map(async (file) => {
            const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
            await tx.tai_lieu.create({
              data: {
                ten_tai_lieu: originalName,
                url: relativePath,
                id_bao_cao: baoCao.id,
              },
            });
          })
        );
        return baoCao
      });

      //If success remove file to relative folder
      await Promise.all(
        files.map(async (file) => {
          const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
          const destPath = path.join(uploadRoot, originalName);
          await fs.rename(file.path, destPath);
        })
      );

      return baoCao
    } catch (error) {
      throw error
    } finally {
      if (files?.length) {
        const tempDir = path.dirname(files[0].path);
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    }
  }

  async findAll() {
    return await this.prismaService.bao_cao.findMany({
      include: {
        tai_lieu: true,
        sinh_vien: {
          include: { tai_khoan: true }
        }
      }
    });
  }

  async findOne(id: number) {
    return await this.prismaService.bao_cao.findUnique({
      where: { id },
      include: { tai_lieu: true }
    })
  }

  async update(idBaoCao: number, newData: any, newFiles: any, deleteOldFiles: any, idSinhVien: number) {
    let relativePath = ""
    let uploadRoot = ""
    try {

      const baoCao = await this.prismaService.bao_cao.findUnique({ where: { id: idBaoCao } })
      if (!baoCao) throw new NotFoundException('Không tìm thấy báo cáo')
      if (baoCao.id_sinh_vien !== idSinhVien) throw new ForbiddenException('Bạn không có quyền chỉnh sửa')

      //BUSINESS

      const baoCaoUpdated = await this.prismaService.$transaction(async (tx) => {
        const baoCaoUpdated = await tx.bao_cao.update({
          where: { id: idBaoCao },
          data: {
            trang_thai: "Đã chỉnh sửa",
            noi_dung: newData.noi_dung,
            ngay_chinh_sua: new Date()
          }
        })
        if (newFiles.length) {
          relativePath = path.join(
            'uploads',
            'bao_cao',
            "de_tai_" + String(newData.idDeTai),
            "bao_cao_" + String(baoCaoUpdated.id),
            "sinh_vien_" + String(idSinhVien))
          uploadRoot = path.join(
            process.cwd(),
            relativePath
          );
          await fs.mkdir(uploadRoot, { recursive: true });
        }
        await Promise.all(
          deleteOldFiles.map(async (file) => {
            await tx.tai_lieu.delete({
              where: { id: file.id }
            });
          })
        );
        await Promise.all(
          newFiles.map(async (file) => {
            const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
            await tx.tai_lieu.create({
              data: {
                ten_tai_lieu: originalName,
                url: relativePath,
                id_bao_cao: baoCaoUpdated.id,
              },
            });
          })
        );
        return baoCaoUpdated
      });

      //If success delete old file of request
      await Promise.all(
        deleteOldFiles.map(async (file) => {
          const destPath = path.join(process.cwd(), file.url, file.ten_tai_lieu);
          await fs.unlink(destPath);
        })
      );


      //If success remove file to relative folder
      await Promise.all(
        newFiles.map(async (file) => {
          const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
          const destPath = path.join(uploadRoot, originalName);
          await fs.rename(file.path, destPath);
        })
      );

      return baoCaoUpdated


    } catch (error) {
      throw error
    } finally {
      if (newFiles?.length) {
        const tempDir = path.dirname(newFiles[0].path);
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    }
  }

  async remove(idBaoCao: number, idSinhVien: number) {
    const baoCao = await this.prismaService.bao_cao.findUnique({ where: { id: idBaoCao } })
    if (!baoCao) throw new NotFoundException('Không tìm thấy báo cáo')
    if (baoCao.id_sinh_vien !== idSinhVien) throw new ForbiddenException('Bạn không có quyền chỉnh sửa')

    //BUSINESS

    const baoCaoDeleted = await this.prismaService.$transaction(async (tx) => {
      await tx.tai_lieu.deleteMany({
        where: { id_bao_cao: baoCao.id }
      })
      const baoCaoDeleted = await tx.bao_cao.delete({
        where: { id: idBaoCao }
      })
      return baoCaoDeleted
    })


    const relativePath = path.join(
      'uploads',
      'bao_cao',
      "de_tai_" + String(baoCaoDeleted.id_de_tai),
      "bao_cao_" + String(baoCaoDeleted.id))

    const uploadRoot = path.join(
      process.cwd(),
      relativePath
    );
    await fs.rm(uploadRoot, { recursive: true, force: true });

    return baoCaoDeleted;
  }
}
