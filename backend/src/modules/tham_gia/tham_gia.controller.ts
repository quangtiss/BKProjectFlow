import { Controller } from '@nestjs/common';
import { ThamGiaService } from './tham_gia.service';

@Controller('tham_gia')
export class ThamGiaController {
  constructor(private readonly thamGiaService: ThamGiaService) { }
}
