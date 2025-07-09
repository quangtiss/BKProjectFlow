import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { MoiQuanTamService } from './moi_quan_tam.service';

@Controller('moi-quan-tam')
export class MoiQuanTamController {
  constructor(private readonly moiQuanTamService: MoiQuanTamService) { }

  @Post()
  create(@Body() body) {
    return this.moiQuanTamService.create(body);
  }

  @Get()
  findAll() {
    return this.moiQuanTamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moiQuanTamService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.moiQuanTamService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moiQuanTamService.delete(+id);
  }
}
