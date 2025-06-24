import { Controller } from '@nestjs/common';
import { LichTrinhService } from './lich_trinh.service';

@Controller('lich_trinh')
export class LichTrinhController {
  constructor(private readonly lichTrinhService: LichTrinhService) { }
}
