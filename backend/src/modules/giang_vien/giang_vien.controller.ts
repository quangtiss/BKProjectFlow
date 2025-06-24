import { Controller } from '@nestjs/common';
import { GiangVienService } from './giang_vien.service';

@Controller('giang_vien')
export class GiangVienController {
  constructor(private readonly giangVienService: GiangVienService) { }
}
