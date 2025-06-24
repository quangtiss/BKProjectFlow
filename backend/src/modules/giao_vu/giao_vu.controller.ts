import { Controller } from '@nestjs/common';
import { GiaoVuService } from './giao_vu.service';

@Controller('giao_vu')
export class GiaoVuController {
  constructor(private readonly giaoVuService: GiaoVuService) { }
}
