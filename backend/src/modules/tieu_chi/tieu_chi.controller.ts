import { Controller } from '@nestjs/common';
import { TieuChiService } from './tieu_chi.service';

@Controller('tieu_chi')
export class TieuChiController {
  constructor(private readonly tieuChiService: TieuChiService) { }
}
