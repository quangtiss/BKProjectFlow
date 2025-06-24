import { Controller } from '@nestjs/common';
import { KetQuaService } from './ket_qua.service';

@Controller('ket_qua')
export class KetQuaController {
  constructor(private readonly ketQuaService: KetQuaService) { }
}
