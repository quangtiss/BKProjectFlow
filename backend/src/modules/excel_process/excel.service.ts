// excel.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'prisma/prisma.service';
import * as argon2 from "argon2";

@Injectable()
export class ExcelService {
    constructor(private prisma: PrismaService) { }

    async processExcel(filePath: string, role: string) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.worksheets[0]; // sheet đầu tiên
            const batchSize = 500; // insert 500 dòng một lần
            let batch: any[] = [];

            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber === 1) return; // bỏ dòng header

                //Thông tin chung
                const ho = row.getCell(2).value?.toString();
                const ten = row.getCell(3).value?.toString();
                const ten_tai_khoan = row.getCell(4).value?.toString();
                const mat_khau = row.getCell(5).value?.toString();
                const email = row.getCell(6).value?.toString();


                if (role === 'Sinh viên') {
                    const mssv = row.getCell(1).value?.toString();
                    const nganh = row.getCell(7).value?.toString();
                    const nam_dao_tao = Number(row.getCell(8).value?.toString()) || undefined;
                    const he_dao_tao = row.getCell(9).value?.toString();
                    const ngon_ngu = row.getCell(10).value?.toString();

                    batch.push({ mssv, ho, ten, ten_tai_khoan, mat_khau, email, nganh, nam_dao_tao, he_dao_tao, ngon_ngu });
                } else if (role === 'Giảng viên') {
                    const msgv = row.getCell(1).value?.toString();
                    const to_chuyen_nganh = row.getCell(7).value?.toString();
                    const is_giang_vien_truong_bo_mon = row.getCell(8).value;
                    batch.push({ msgv, ho, ten, ten_tai_khoan, mat_khau, email, to_chuyen_nganh, is_giang_vien_truong_bo_mon });
                } else {
                    const msnv = row.getCell(1).value?.toString();
                    const chuc_vu = row.getCell(7).value?.toString();
                    batch.push({ msnv, ho, ten, ten_tai_khoan, mat_khau, email, chuc_vu });
                }

                if (batch.length >= batchSize) {
                    this.flushBatch(batch, role);
                    batch = [];
                }
            });

            if (batch.length > 0) {
                await this.flushBatch(batch, role);
            }
            return { message: 'Upload file thành công' }
        } catch (error) {
            throw error
        } finally {
            // Xóa file cha
            const dirPath = path.dirname(filePath); // ./temp/abcxyz
            fs.rmSync(dirPath, { recursive: true, force: true });
        }
    }

    private async flushBatch(batch: any[], role: string) {
        await this.prisma.$transaction(async (tx) => {
            for (const data of batch) {
                const hashed = await argon2.hash(data.mat_khau);
                const taiKhoan = await tx.tai_khoan.create({
                    data: {
                        ho: data.ho,
                        ten: data.ten,
                        ten_tai_khoan: data.ten_tai_khoan,
                        mat_khau: hashed,
                        email: data.email,
                        vai_tro: role !== 'Giảng viên' ? role : (data.is_giang_vien_truong_bo_mon ? 'Giảng viên trưởng bộ môn' : role)
                    }
                })
                if (role === 'Sinh viên')
                    await tx.sinh_vien.create({
                        data: {
                            mssv: data.mssv,
                            nganh: data.nganh,
                            nam_dao_tao: data.nam_dao_tao,
                            he_dao_tao: data.he_dao_tao,
                            ngon_ngu: data.ngon_ngu,
                            id_tai_khoan: taiKhoan.id
                        }
                    })
                else if (role === 'Giảng viên')
                    await tx.giang_vien.create({
                        data: {
                            msgv: data.msgv,
                            to_chuyen_nganh: data.to_chuyen_nganh,
                            is_giang_vien_truong_bo_mon: data.is_giang_vien_truong_bo_mon,
                            id_tai_khoan: taiKhoan.id
                        }
                    })
                else
                    await tx.giao_vu.create({
                        data: {
                            msnv: data.msnv,
                            chuc_vu: data.chuc_vu,
                            id_tai_khoan: taiKhoan.id
                        }
                    })
            }
        });
    }
}
