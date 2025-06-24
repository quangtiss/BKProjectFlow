import { Controller } from '@nestjs/common';
import { TaiLieuBaoCaoService } from './tai_lieu_bao_cao.service';

@Controller('tai_lieu_bao_cao')
export class TaiLieuBaoCaoController {
  constructor(private readonly taiLieuBaoCaoService: TaiLieuBaoCaoService) { }
}
