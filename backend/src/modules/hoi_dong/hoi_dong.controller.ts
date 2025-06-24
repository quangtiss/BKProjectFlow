import { Controller } from '@nestjs/common';
import { HoiDongService } from './hoi_dong.service';

@Controller('hoi_dong')
export class HoiDongController {
  constructor(private readonly hoiDongService: HoiDongService) { }
}
