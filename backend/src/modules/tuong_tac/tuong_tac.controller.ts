import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { TuongTacService } from './tuong_tac.service';
@Controller('tuong-tac')
export class TuongTacController {
  constructor(private readonly tuongTacService: TuongTacService) { }

  @Get('/nguoi-dung')
  getThongBaoCurrentUser(@Req() req, @Query() query) {
    return this.tuongTacService.getThongBaoCurrentUser(req.user.sub, query)
  }

  @Get('/nguoi-dung/count')
  countThongBaoCurrentUser(@Req() req, @Query() query) {
    return this.tuongTacService.countThongBaoCurrentUser(req.user.sub, query)
  }

  @Get('/:id')
  setRead(@Param('id') id) {
    return this.tuongTacService.setRead(+id)
  }
}
