import { Controller } from '@nestjs/common';
import { DangKiService } from './dang_ki.service';

@Controller('dang_ki')
export class DangKiController {
  constructor(private readonly dangKiService: DangKiService) { }
}
