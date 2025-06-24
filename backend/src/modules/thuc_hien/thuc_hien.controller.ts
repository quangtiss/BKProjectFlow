import { Controller } from '@nestjs/common';
import { ThucHienService } from './thuc_hien.service';

@Controller('thuc_hien')
export class ThucHienController {
  constructor(private readonly thucHienService: ThucHienService) { }
}
