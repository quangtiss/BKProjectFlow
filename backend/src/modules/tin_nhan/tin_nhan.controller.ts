import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { TinNhanService } from './tin_nhan.service';

@Controller('tin-nhan')
export class TinNhanController {
  constructor(private readonly tinNhanService: TinNhanService) { }

  @Post()
  create(@Body() body) {
    return this.tinNhanService.create(body);
  }

  @Get()
  findAll() {
    return this.tinNhanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tinNhanService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.tinNhanService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tinNhanService.delete(+id);
  }
}
