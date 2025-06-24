import { Controller } from '@nestjs/common';
import { HuongDanService } from './huong_dan.service';

@Controller('huong_dan')
export class HuongDanController {
  constructor(private readonly huongDanService: HuongDanService) { }
}
