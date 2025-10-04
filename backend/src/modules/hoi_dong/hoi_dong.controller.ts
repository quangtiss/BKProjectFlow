import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { HoiDongService } from './hoi_dong.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('hoi-dong')
export class HoiDongController {
  constructor(private readonly hoiDongService: HoiDongService) { }

  @Roles('Giảng viên trưởng bộ môn')
  @Post()
  create(@Body() body) {
    return this.hoiDongService.create(body);
  }

  @Get()
  findAll() {
    return this.hoiDongService.findAll();
  }

  @Get('/hoc-ky/:id')
  findByIdHocKy(@Param('id') id: string) {
    return this.hoiDongService.findByIdHocKy(+id);
  }

  @Roles('Giảng viên trưởng bộ môn')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.hoiDongService.update(+id, body);
  }

  @Roles('Giảng viên trưởng bộ môn')
  @Post('phan-chia-de-tai')
  phanChiaDeTai(@Body() body) {
    return this.hoiDongService.phanChiaDeTai(body);
  }

  @Roles('Giảng viên trưởng bộ môn')
  @Get('/xoa-de-tai/:id')
  removeDeTaiFromHoiDong(@Param('id') id: string) {
    return this.hoiDongService.removeDeTaiFromHoiDong(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hoiDongService.delete(+id);
  }
}
