import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { HoiDongService } from './hoi_dong.service';

@Controller('hoi-dong')
export class HoiDongController {
  constructor(private readonly hoiDongService: HoiDongService) { }

  @Post()
  create(@Body() body) {
    return this.hoiDongService.create(body);
  }

  @Get()
  findAll() {
    return this.hoiDongService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hoiDongService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.hoiDongService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hoiDongService.delete(+id);
  }
}
