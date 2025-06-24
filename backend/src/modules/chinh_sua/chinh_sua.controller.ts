import { Controller } from '@nestjs/common';
import { ChinhSuaService } from './chinh_sua.service';

@Controller('chinh_sua')
export class ChinhSuaController {
  constructor(private readonly chinhSuaService: ChinhSuaService) { }
}
