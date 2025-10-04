import { BaoCaoService } from './bao_cao.service';
import { Roles } from '../auth/guard/roles.decorator';
import { Controller, Get, Post, Patch, Delete, Body, UseInterceptors, UploadedFiles, Req, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('bao-cao')
export class BaoCaoController {
  constructor(private readonly baoCaoService: BaoCaoService) { }

  @Roles('Sinh viên')
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
    return this.baoCaoService.create(JSON.parse(rawData), files, req.user.sub);
  }

  @Get('/de-tai/:idDeTai')
  findAllWithIdDeTai(@Param('idDeTai') idDeTai: string) {
    return this.baoCaoService.findAllWithIdDeTai(+idDeTai);
  }

  @Get('/:idBaoCao')
  findOne(@Param('idBaoCao') idBaoCao) {
    return this.baoCaoService.findOne(+idBaoCao)
  }

  @Roles('Sinh viên')
  @Patch('/:idBaoCao')
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
  update(@Param('idBaoCao') idBaoCao, @Body('data') newData, @UploadedFiles() newFiles, @Body('deleteOldFiles') deleteOldFiles, @Req() req) {
    return this.baoCaoService.update(+idBaoCao, JSON.parse(newData), newFiles, JSON.parse(deleteOldFiles), req.user.sub)
  }

  @Roles('Sinh viên')
  @Delete('/:idBaoCao')
  delete(@Param('idBaoCao') idBaoCao, @Req() req) {
    return this.baoCaoService.remove(+idBaoCao, req.user.sub)
  }
}
