import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { HuongDanService } from './huong_dan.service';

@Controller('huong_dan')
export class HuongDanController {
  constructor(private readonly huongDanService: HuongDanService) { }

  @Post()
  create(@Body() body) {
    return this.huongDanService.create(body);
  }

  @Get()
  findAll() {
    return this.huongDanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.huongDanService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.huongDanService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.huongDanService.delete(+id);
  }
}
