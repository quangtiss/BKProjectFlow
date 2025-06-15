import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TaiKhoanService } from './TaiKhoan.service';

@Controller('tai_khoan')
export class TaiKhoanController {
  constructor(private readonly taikhoanService: TaiKhoanService) {}

  @Get()
  findAll() {
    return this.taikhoanService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.taikhoanService.findById(id);
  }
}
