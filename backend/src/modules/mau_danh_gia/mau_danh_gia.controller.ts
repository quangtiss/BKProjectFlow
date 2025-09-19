import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { MauDanhGiaService } from './mau_danh_gia.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('mau-danh-gia')
export class MauDanhGiaController {
  constructor(private readonly mauDanhGiaService: MauDanhGiaService) { }

  @Roles('Giáo vụ')
  @Post()
  create(@Body() body) {
    return this.mauDanhGiaService.create(body);
  }

  @Get()
  findAll() {
    return this.mauDanhGiaService.findAll();
  }

  @Roles('Giảng viên', 'Giảng viên trưởng bộ môn')
  @Get('/giang-vien')
  findWithGiangVien(@Query('type') type) {
    return this.mauDanhGiaService.findWithGiangVien(type)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mauDanhGiaService.findById(+id);
  }

  @Roles('Giáo vụ')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.mauDanhGiaService.update(+id, body);
  }

  @Roles('Giáo vụ')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mauDanhGiaService.delete(+id);
  }
}
