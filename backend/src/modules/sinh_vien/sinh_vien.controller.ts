import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { SinhVienService } from './sinh_vien.service';
import { CreateSinhVienDTO } from './dto/create_sinh_vien.dto';

@Controller('sinh-vien')
export class SinhVienController {
  constructor(private readonly sinhVienService: SinhVienService) { }

  @Post()
  create(@Body() body: CreateSinhVienDTO) {
    return this.sinhVienService.create(body);
  }

  @Get()
  findAll() {
    return this.sinhVienService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sinhVienService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.sinhVienService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sinhVienService.delete(+id);
  }
}
