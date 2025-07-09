import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { NhiemVuService } from './nhiem_vu.service';

@Controller('nhiem-vu')
export class NhiemVuController {
  constructor(private readonly nhiemVuService: NhiemVuService) { }

  @Post()
  create(@Body() body) {
    return this.nhiemVuService.create(body);
  }

  @Get()
  findAll() {
    return this.nhiemVuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nhiemVuService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.nhiemVuService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nhiemVuService.delete(+id);
  }
}
