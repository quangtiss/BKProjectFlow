import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { HocKiService } from './HocKi.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('hoc_ki')
export class HocKiController {
    constructor(private readonly hockiService: HocKiService) { }

    @Get()
    findAll() {
        return this.hockiService.findAll()
    }


    @Roles('Giáo vụ') //Chỉ giáo vụ được dùng api này
    @Post()
    create(@Body() body) {
        return this.hockiService.create(body)
    }
}
