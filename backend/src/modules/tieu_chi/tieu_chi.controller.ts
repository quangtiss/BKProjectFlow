import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { TieuChiService } from './tieu_chi.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('tieu-chi')
export class TieuChiController {
  constructor(private readonly tieuChiService: TieuChiService) { }

  @Roles('Giáo vụ')
  @Post()
  create(@Body() body) {
    return this.tieuChiService.create(body);
  }

  @Get()
  findAll() {
    return this.tieuChiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tieuChiService.findById(+id);
  }

  @Roles('Giáo vụ')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.tieuChiService.update(+id, body);
  }

  @Roles('Giáo vụ')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tieuChiService.delete(+id);
  }
}
