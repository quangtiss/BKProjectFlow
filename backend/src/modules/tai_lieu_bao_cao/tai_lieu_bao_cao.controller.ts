import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { TaiLieuBaoCaoService } from './tai_lieu_bao_cao.service';

@Controller('tai_lieu_bao_cao')
export class TaiLieuBaoCaoController {
  constructor(private readonly taiLieuBaoCaoService: TaiLieuBaoCaoService) { }

  @Post()
  create(@Body() body) {
    return this.taiLieuBaoCaoService.create(body);
  }

  @Get()
  findAll() {
    return this.taiLieuBaoCaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taiLieuBaoCaoService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.taiLieuBaoCaoService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taiLieuBaoCaoService.delete(+id);
  }
}
