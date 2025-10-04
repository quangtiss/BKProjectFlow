import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhanBienService } from './phan_bien.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('phan-bien')
export class PhanBienController {
  constructor(private readonly phanBienService: PhanBienService) { }

  @Roles('Giảng viên trưởng bộ môn')
  @Post()
  create(@Body() data) {
    return this.phanBienService.create(data)
  }


  @Roles('Giảng viên trưởng bộ môn')
  @Patch()
  update(@Body() data) {
    return this.phanBienService.update(data)
  }
}
