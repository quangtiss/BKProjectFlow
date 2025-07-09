import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { GiangVienTruongBoMonService } from './giang_vien_truong_bo_mon.service';

@Controller('giang-vien-truong-bo-mon')
export class GiangVienTruongBoMonController {
  constructor(private readonly giangVienTruongBoMonService: GiangVienTruongBoMonService) { }

  @Post()
  create(@Body() body) {
    return this.giangVienTruongBoMonService.create(body);
  }

  @Get()
  findAll() {
    return this.giangVienTruongBoMonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giangVienTruongBoMonService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.giangVienTruongBoMonService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giangVienTruongBoMonService.delete(+id);
  }
}
