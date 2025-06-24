import { Controller } from '@nestjs/common';
import { NhiemVuService } from './nhiem_vu.service';

@Controller('nhiem_vu')
export class NhiemVuController {
  constructor(private readonly nhiemVuService: NhiemVuService) { }
}
