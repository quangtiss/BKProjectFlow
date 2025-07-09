import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ThucHienService } from './thuc_hien.service';

@Controller('thuc-hien')
export class ThucHienController {
  constructor(private readonly thucHienService: ThucHienService) { }

  @Post()
  create(@Body() body) {
    return this.thucHienService.create(body);
  }

  @Get()
  findAll() {
    return this.thucHienService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thucHienService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.thucHienService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thucHienService.delete(+id);
  }
}
