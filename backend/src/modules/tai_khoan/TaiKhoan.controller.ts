import { Controller, Get } from '@nestjs/common';
import { TaiKhoanService } from './TaiKhoan.service';

@Controller('tai_khoan')
export class TaiKhoanController {
  constructor(private readonly taikhoanService: TaiKhoanService) {}

  @Get()
  findAll() {
    return this.taikhoanService.findAll();
  }
}
