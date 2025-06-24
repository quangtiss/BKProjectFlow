import { Controller } from '@nestjs/common';
import { ChuDeService } from './chu_de.service';

@Controller('chu_de')
export class ChuDeController {
    constructor(private readonly chuDeService: ChuDeService) { }
}
