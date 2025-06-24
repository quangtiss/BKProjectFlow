import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { MoiLienQuanService } from './moi_lien_quan.service';

@Controller('moi_lien_quan')
export class MoiLienQuanController {
  constructor(private readonly moiLienQuanService: MoiLienQuanService) { }

  @Post()
  create(@Body() body) {
    return this.moiLienQuanService.create(body);
  }

  @Get()
  findAll() {
    return this.moiLienQuanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moiLienQuanService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.moiLienQuanService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moiLienQuanService.delete(+id);
  }
}
