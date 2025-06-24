import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ChinhSuaService } from './chinh_sua.service';

@Controller('chinh_sua')
export class ChinhSuaController {
  constructor(private readonly chinhSuaService: ChinhSuaService) { }

  @Post()
  create(@Body() body) {
    return this.chinhSuaService.create(body);
  }

  @Get()
  findAll() {
    return this.chinhSuaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chinhSuaService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.chinhSuaService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chinhSuaService.delete(+id);
  }
}
