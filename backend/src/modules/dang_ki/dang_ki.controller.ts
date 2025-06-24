import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { DangKiService } from './dang_ki.service';

@Controller('dang_ki')
export class DangKiController {
  constructor(private readonly dangKiService: DangKiService) { }

  @Post()
  create(@Body() body) {
    return this.dangKiService.create(body);
  }

  @Get()
  findAll() {
    return this.dangKiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dangKiService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.dangKiService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dangKiService.delete(+id);
  }
}
