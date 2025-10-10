import { Controller, Get, Post, Patch, Delete, Body, Param, Req, Query } from '@nestjs/common';
import { ChamDiemService } from './cham_diem.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('cham-diem')
export class ChamDiemController {
    constructor(private readonly chamDiemService: ChamDiemService) { }

    @Get()
    findAll(@Query() query) {
        return this.chamDiemService.findAll(query)
    }

    @Roles('Giảng viên', 'Giảng viên trưởng bộ môn')
    @Post()
    create(@Body() body, @Req() req) {
        return this.chamDiemService.create(body, req.user.sub);
    }

    @Roles('Giảng viên', 'Giảng viên trưởng bộ môn')
    @Post('/update-all')
    updateAll(@Body() body, @Req() req) {
        return this.chamDiemService.updateAll(body);
    }
}
