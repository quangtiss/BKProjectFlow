import { Controller } from '@nestjs/common';
import { MoiLienQuanService } from './moi_lien_quan.service';

@Controller('moi_lien_quan')
export class MoiLienQuanController {
  constructor(private readonly moiLienQuanService: MoiLienQuanService) { }
}
