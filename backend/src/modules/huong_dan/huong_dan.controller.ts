import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { HuongDanService } from './huong_dan.service';
import { UpdateTrangThaiHuongDanDTO } from './dto/update_huong_dan_trang_thai.dto';
import { Roles } from '../auth/guard/roles.decorator';
import { QueryHuongDanDTO } from './dto/query_huong_dan.dto';

@Controller('huong-dan')
export class HuongDanController {
  constructor(private readonly huongDanService: HuongDanService) { }

  @Post()
  create(@Body() body) {
    return this.huongDanService.create(body);
  }

  @Get()
  findAll() {
    return this.huongDanService.findAll();
  }

  @Roles('Giảng viên')
  @Get('/giang-vien')
  findByCurrentIdGiangVien(@Request() req, @Query() query: QueryHuongDanDTO) {
    return this.huongDanService.findByCurrentIdGiangVien(req.user.sub, query);
  }


  @Roles('Giảng viên')
  @Patch('trang-thai/:id')
  update(@Param('id') idHuongDan: string, @Body() updateHuongDanData: UpdateTrangThaiHuongDanDTO, @Request() req) {
    return this.huongDanService.update(+idHuongDan, updateHuongDanData, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.huongDanService.delete(+id);
  }
}
