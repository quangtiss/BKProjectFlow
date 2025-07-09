import { Controller, Get, Param, ParseIntPipe, Patch, Request, Body, Post, Delete } from '@nestjs/common';
import { TaiKhoanService } from './tai_khoan.service';
import { UpdateTaiKhoanDTO } from './dto/update_tai_khoan';

@Controller('tai-khoan')
export class TaiKhoanController {
  constructor(private readonly taiKhoanService: TaiKhoanService) { }

  @Get()
  findAll() {
    return this.taiKhoanService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.taiKhoanService.findById(id);
  }

  @Patch()
  update(@Body() body: UpdateTaiKhoanDTO, @Request() req) {
    return this.taiKhoanService.update(req.user.sub, body)
  }

  @Post()
  create(@Body() body) {
    return this.taiKhoanService.create(body);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taiKhoanService.delete(+id);
  }
}
