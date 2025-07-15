import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { DangKiService } from './dang_ky.service';
import { QueryDangKy } from './dto/query_dang_ky.dto';

@Controller('dang-ky')
export class DangKiController {
  constructor(private readonly dangKiService: DangKiService) { }

  @Post()
  create(@Body() body) {
    return this.dangKiService.create(body);
  }

  @Get()
  findAll(@Query() query: QueryDangKy) {
    return this.dangKiService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dangKiService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.dangKiService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dangKiService.delete(+id);
  }
}
