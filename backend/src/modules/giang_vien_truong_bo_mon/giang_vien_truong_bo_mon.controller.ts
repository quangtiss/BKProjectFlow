import { Controller } from '@nestjs/common';
import { GiangVienTruongBoMonService } from './giang_vien_truong_bo_mon.service';

@Controller('giang_vien_truong_bo_mon')
export class GiangVienTruongBoMonController {
  constructor(private readonly giangVienTruongBoMonService: GiangVienTruongBoMonService) { }
}
