import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { GiaoVuService } from './giao_vu.service';

@Controller('giao-vu')
export class GiaoVuController {
  constructor(private readonly giaoVuService: GiaoVuService) { }

  @Post()
  create(@Body() body) {
    return this.giaoVuService.create(body);
  }

  @Get()
  findAll() {
    return this.giaoVuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giaoVuService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.giaoVuService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giaoVuService.delete(+id);
  }
}
