import { Controller, Get, Param, ParseIntPipe, Patch, Request, Body } from '@nestjs/common';
import { TaiKhoanService } from './TaiKhoan.service';
import { UpdateBaseInformationDTO } from './dto/updateBaseInfo.dto';

@Controller('tai_khoan')
export class TaiKhoanController {
  constructor(private readonly taikhoanService: TaiKhoanService) { }

  @Get()
  findAll() {
    return this.taikhoanService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.taikhoanService.findById(id);
  }

  @Patch()
  update(@Body() body: UpdateBaseInformationDTO, @Request() req) {
    return this.taikhoanService.update(req.user.sub, body)
  }
}
