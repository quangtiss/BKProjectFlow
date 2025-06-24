import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { KetQuaService } from './ket_qua.service';

@Controller('ket_qua')
export class KetQuaController {
  constructor(private readonly ketQuaService: KetQuaService) { }

  @Post()
  create(@Body() body) {
    return this.ketQuaService.create(body);
  }

  @Get()
  findAll() {
    return this.ketQuaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ketQuaService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.ketQuaService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ketQuaService.delete(+id);
  }
}
