import { Roles } from './../auth/guard/roles.decorator';
import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { LichTrinhService } from './lich_trinh.service';

@Controller('lich-trinh')
export class LichTrinhController {
  constructor(private readonly lichTrinhService: LichTrinhService) { }

  @Roles('Giáo vụ')
  @Post()
  create(@Body() body, @Req() req) {
    return this.lichTrinhService.create(body, req.user.sub);
  }

  @Get('/hoc-ky-now')
  findAllByCurrentHocKy() {
    return this.lichTrinhService.findAllByCurrentHocKy();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lichTrinhService.findById(+id);
  }

  @Roles('Giáo vụ')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body, @Req() req) {
    return this.lichTrinhService.update(+id, body, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.lichTrinhService.delete(+id, req.user.sub);
  }
}
