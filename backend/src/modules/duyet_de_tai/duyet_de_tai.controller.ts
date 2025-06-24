import { Controller } from '@nestjs/common';
import { DuyetDeTaiService } from './duyet_de_tai.service';

@Controller('duyet_de_tai')
export class DuyetDeTaiController {
    constructor(private readonly duyetDeTaiService: DuyetDeTaiService) { }
}
