import { Controller, Get, Post, Body, Param, Res, Req } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Roles } from '../auth/guard/roles.decorator';
import { Public } from '../auth/guard/public.decorator';
import { join } from 'path';

@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) { }

  @Public()
  @Post('generate-topic')
  getTopicFromDescription(@Body() body) {
    return this.utilsService.generateTopicFromDescription(body, 2)
  }

  @Get('file/:id/:filename')
  getProjectFile(@Param('id') id: string, @Res() res) {
    return this.utilsService.getFile(+id, res)
  }

  @Roles('Sinh viên')
  @Get('get-recommend')
  getDeTaiRecommend(@Req() req) {
    return this.utilsService.getDeTaiRecommend(req.user.sub)
  }
}
