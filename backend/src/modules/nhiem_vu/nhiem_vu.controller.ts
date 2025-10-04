import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { NhiemVuService } from './nhiem_vu.service';
import { Roles } from '../auth/guard/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('nhiem-vu')
export class NhiemVuController {
  constructor(private readonly nhiemVuService: NhiemVuService) { }

  @Roles("Giảng viên", "Giảng viên trưởng bộ môn")
  @Post()
  @UseInterceptors(FilesInterceptor('files', 5, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        if (!req.tempDir) {
          req.tempDir = path.join(process.cwd(), 'uploads/temp', crypto.randomUUID());
          fs.mkdirSync(req.tempDir, { recursive: true });
        }
        cb(null, req.tempDir);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname); // giữ nguyên tên file gốc
      }
    })
  }))
  create(@Body('data') rawData, @UploadedFiles() files, @Req() req) {
    return this.nhiemVuService.create(JSON.parse(rawData), files, req.user);
  }

  @Get('/de-tai/:id')
  findAllWithIdDeTai(@Param('id') id: string) {
    return this.nhiemVuService.findAllWithIdDeTai(+id);
  }

  @Get('/count/de-tai/:idDeTai')
  countByIdDetai(@Param('idDeTai') idDeTai: string) {
    return this.nhiemVuService.countByIdDeTai(+idDeTai)
  }

  @Roles("Giảng viên", "Giảng viên trưởng bộ môn")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nhiemVuService.findById(+id);
  }

  @Roles("Giảng viên", "Giảng viên trưởng bộ môn")
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 5, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        if (!req.tempDir) {
          req.tempDir = path.join(process.cwd(), 'uploads/temp', crypto.randomUUID());
          fs.mkdirSync(req.tempDir, { recursive: true });
        }
        cb(null, req.tempDir);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname); // giữ nguyên tên file gốc
      }
    })
  }))
  update(@Param('id') id: string, @UploadedFiles() files, @Body('data') rawData, @Body('oldFileDeleted') oldFileDeleted, @Req() req) {
    return this.nhiemVuService.update(+id, files, JSON.parse(rawData), JSON.parse(oldFileDeleted), req.user);
  }

  @Roles("Giảng viên", "Giảng viên trưởng bộ môn")
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.nhiemVuService.delete(+id, req.user);
  }
}
