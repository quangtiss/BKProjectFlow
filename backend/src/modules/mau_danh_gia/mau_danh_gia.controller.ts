import { Controller } from '@nestjs/common';
import { MauDanhGiaService } from './mau_danh_gia.service';

@Controller('mau_danh_gia')
export class MauDanhGiaController {
  constructor(private readonly mauDanhGiaService: MauDanhGiaService) { }
}
