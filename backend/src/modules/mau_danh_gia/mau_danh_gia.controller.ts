import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { MauDanhGiaService } from './mau_danh_gia.service';

@Controller('mau_danh_gia')
export class MauDanhGiaController {
  constructor(private readonly mauDanhGiaService: MauDanhGiaService) { }

  @Post()
  create(@Body() body) {
    return this.mauDanhGiaService.create(body);
  }

  @Get()
  findAll() {
    return this.mauDanhGiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mauDanhGiaService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.mauDanhGiaService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mauDanhGiaService.delete(+id);
  }
}
