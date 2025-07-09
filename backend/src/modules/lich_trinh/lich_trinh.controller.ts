import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { LichTrinhService } from './lich_trinh.service';

@Controller('lich-trinh')
export class LichTrinhController {
  constructor(private readonly lichTrinhService: LichTrinhService) { }

  @Post()
  create(@Body() body) {
    return this.lichTrinhService.create(body);
  }

  @Get()
  findAll() {
    return this.lichTrinhService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lichTrinhService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.lichTrinhService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lichTrinhService.delete(+id);
  }
}
