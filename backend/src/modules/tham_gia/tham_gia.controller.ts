import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ThamGiaService } from './tham_gia.service';

@Controller('tham-gia')
export class ThamGiaController {
  constructor(private readonly thamGiaService: ThamGiaService) { }

  @Post()
  create(@Body() body) {
    return this.thamGiaService.create(body);
  }

  @Get()
  findAll() {
    return this.thamGiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thamGiaService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.thamGiaService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thamGiaService.delete(+id);
  }
}
