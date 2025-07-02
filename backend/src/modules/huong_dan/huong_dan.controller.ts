import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { HuongDanService } from './huong_dan.service';
import { UpdateTrangThaiHuongDanDTO } from './dto/update_trang_thai.dto';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('huong_dan')
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
  @Get('/current_user')
  findWithCurrentGiangVien(@Query() query: { trang_thai?: string }, @Request() req) {
    return this.huongDanService.findWithCurrentGiangVien(query, req.user)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.huongDanService.findById(+id);
  }


  @Roles('Giảng viên')
  @Patch('accept/:id')
  update(@Param('id') id: string, @Body() updateHuongDanData: UpdateTrangThaiHuongDanDTO) {
    return this.huongDanService.update(+id, updateHuongDanData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.huongDanService.delete(+id);
  }
}
