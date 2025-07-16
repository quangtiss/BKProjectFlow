import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { DangKiService } from './dang_ky.service';
import { QueryDangKy } from './dto/query_dang_ky.dto';
import { UpdateTrangThaiDangKyDTO } from './dto/update_trang_thai_dang_ky.dto';

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

  @Get('/sinh-vien')
  findByCurrentSinhVien(@Request() req, @Query() query: QueryDangKy) {
    return this.dangKiService.findByCurrentSinhVien(req.user.sub, query);
  }

  @Patch('trang-thai/:id')
  update(@Param('id') id: string, @Body() body: UpdateTrangThaiDangKyDTO, @Request() req) {
    return this.dangKiService.update(+id, body, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dangKiService.delete(+id);
  }
}
