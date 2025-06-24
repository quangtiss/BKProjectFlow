import { Controller } from '@nestjs/common';
import { ChamDiemService } from './cham_diem.service';

@Controller('cham_diem')
export class ChamDiemController {
    constructor(private readonly chamDiemService: ChamDiemService) { }
}
