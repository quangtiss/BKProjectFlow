import { Controller } from '@nestjs/common';
import { TinNhanService } from './tin_nhan.service';

@Controller('tin_nhan')
export class TinNhanController {
  constructor(private readonly tinNhanService: TinNhanService) { }
}
