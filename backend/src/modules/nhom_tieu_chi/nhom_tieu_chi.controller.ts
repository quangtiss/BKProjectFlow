import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NhomTieuChiService } from './nhom_tieu_chi.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('nhom-tieu-chi')
export class NhomTieuChiController {
  constructor(private readonly nhomTieuChiService: NhomTieuChiService) { }

  @Roles('Giáo vụ')
  @Post()
  create(@Body() createNhomTieuChiDto) {
    return this.nhomTieuChiService.create(createNhomTieuChiDto);
  }

  @Get()
  findAll() {
    return this.nhomTieuChiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nhomTieuChiService.findByIdMauDanhGia(+id);
  }

  @Roles('Giáo vụ')
  @Patch(':id')
  update(@Body() updateNhomTieuChiDto) {
    return this.nhomTieuChiService.update(updateNhomTieuChiDto);
  }

  @Roles('Giáo vụ')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nhomTieuChiService.remove(+id);
  }
}
