import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { TieuChiService } from './tieu_chi.service';

@Controller('tieu-chi')
export class TieuChiController {
  constructor(private readonly tieuChiService: TieuChiService) { }

  @Post()
  create(@Body() body) {
    return this.tieuChiService.create(body);
  }

  @Get()
  findAll() {
    return this.tieuChiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tieuChiService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.tieuChiService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tieuChiService.delete(+id);
  }
}
