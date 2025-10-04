import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { ThamGiaService } from './tham_gia.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('tham-gia')
export class ThamGiaController {
  constructor(private readonly thamGiaService: ThamGiaService) { }

  @Roles('Giảng viên trưởng bộ môn')
  @Post()
  create(@Body() body, @Req() req) {
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
