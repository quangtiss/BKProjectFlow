import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { TaiLieuService } from './tai_lieu.service';

@Controller('tai-lieu')
export class TaiLieuController {
  constructor(private readonly taiLieuService: TaiLieuService) { }

  @Post()
  create(@Body() body) {
    return this.taiLieuService.create(body);
  }

  @Get()
  findAll() {
    return this.taiLieuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taiLieuService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.taiLieuService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taiLieuService.delete(+id);
  }
}
