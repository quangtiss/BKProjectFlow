import { Controller, Get, Post, Patch, Delete, Body, Param, UseInterceptors, UploadedFiles, Req } from '@nestjs/common';
import { ThucHienService } from './thuc_hien.service';
import { Roles } from '../auth/guard/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('thuc-hien')
export class ThucHienController {
  constructor(private readonly thucHienService: ThucHienService) { }

  @Roles("Sinh viên")
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
  create(@Body('data') data, @Req() req, @UploadedFiles() files) {
    return this.thucHienService.create(JSON.parse(data), req.user, files);
  }

  @Get()
  findAll() {
    return this.thucHienService.findAll();
  }

  @Get('nhiem-vu/:id')
  findByIdNhiemVu(@Param('id') id: string) {
    return this.thucHienService.findByIdNhiemVu(+id);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.thucHienService.findById(+id);
  }

  @Roles("Sinh viên")
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
  update(@Param('id') id: string, @Body('data') data, @UploadedFiles() newFiles, @Body('oldFileDeleted') oldFileDeleted, @Req() req) {
    return this.thucHienService.update(+id, JSON.parse(data), newFiles, JSON.parse(oldFileDeleted), req.user);
  }

  @Roles("Sinh viên")
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.thucHienService.delete(+id, req.user);
  }
}
