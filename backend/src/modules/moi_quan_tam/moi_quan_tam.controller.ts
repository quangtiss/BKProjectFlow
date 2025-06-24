import { Controller } from '@nestjs/common';
import { MoiQuanTamService } from './moi_quan_tam.service';

@Controller('moi_quan_tam')
export class MoiQuanTamController {
  constructor(private readonly moiQuanTamService: MoiQuanTamService) { }
}
