import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Roles } from '../auth/guard/roles.decorator';
import { Public } from '../auth/guard/public.decorator';

@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) { }

  @Public()
  @Post('generate-topic')
  getTopicFromDescription(@Body() body) {
    return this.utilsService.generateTopicFromDescription(body, 20)
  }
}
