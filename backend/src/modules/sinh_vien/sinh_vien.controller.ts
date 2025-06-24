import { Controller } from '@nestjs/common';
import { SinhVienService } from './sinh_vien.service';

@Controller('sinh_vien')
export class SinhVienController {
  constructor(private readonly sinhVienService: SinhVienService) { }
}
