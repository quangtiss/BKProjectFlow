import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { GiangVienService } from './giang_vien.service';

@Controller('giang-vien')
export class GiangVienController {
  constructor(private readonly giangVienService: GiangVienService) { }

  @Post()
  create(@Body() body) {
    return this.giangVienService.create(body);
  }

  @Get()
  findAll() {
    return this.giangVienService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giangVienService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.giangVienService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giangVienService.delete(+id);
  }
}
