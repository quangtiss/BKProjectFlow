import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { HocKiService } from './hoc_ki.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('hoc_ki')
export class HocKiController {
    constructor(private readonly hocKiService: HocKiService) { }

    @Get()
    findAll() {
        return this.hocKiService.findAll()
    }


    @Roles('Giáo vụ') //Chỉ giáo vụ được dùng api này
    @Post()
    create(@Body() body) {
        return this.hocKiService.create(body)
    }
}
