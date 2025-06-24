import { Controller, Get, Param, ParseIntPipe, Patch, Request, Body } from '@nestjs/common';
import { TaiKhoanService } from './tai_khoan.service';
import { UpdateBaseInformationDTO } from './dto/update_base_info.dto';

@Controller('tai_khoan')
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
  update(@Body() body: UpdateBaseInformationDTO, @Request() req) {
    return this.taiKhoanService.update(req.user.sub, body)
  }
}
