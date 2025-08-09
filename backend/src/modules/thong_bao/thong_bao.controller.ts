import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ThongBaoService } from './thong_bao.service';
import { CreateThongBaoDto } from './dto/create_thong_bao.dto';
import { UpdateThongBaoDto } from './dto/update_thong_bao.dto';
import { Public } from '../auth/guard/public.decorator';

@Controller('thong-bao')
export class ThongBaoController {
  constructor(private readonly thongBaoService: ThongBaoService) { }

  @Public()
  @Post()
  create() {
    return this.thongBaoService.create();
  }

  @Get('/count-all')
  getCountAll(@Request() req) {
    return this.thongBaoService.getCountAll(req.user)
  }

  @Get()
  findAll() {
    return this.thongBaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thongBaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThongBaoDto: UpdateThongBaoDto) {
    return this.thongBaoService.update(+id, updateThongBaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thongBaoService.remove(+id);
  }
}
