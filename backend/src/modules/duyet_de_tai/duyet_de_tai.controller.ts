import { Controller, Get, Post, Patch, Delete, Body, Param, Request, Query } from '@nestjs/common';
import { DuyetDeTaiService } from './duyet_de_tai.service';
import { Roles } from '../auth/guard/roles.decorator';
import { CreateDuyetDeTaiDTO } from './dto/create_duyet_de_tai';

@Controller('duyet_de_tai')
export class DuyetDeTaiController {
    constructor(private readonly duyetDeTaiService: DuyetDeTaiService) { }

    @Post()
    create(@Body() duyetDeTai: CreateDuyetDeTaiDTO, @Request() req) {
        return this.duyetDeTaiService.create(duyetDeTai, req.user.sub);
    }

    @Get()
    findAll(@Query() query: { trang_thai?: string }) {
        return this.duyetDeTaiService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.duyetDeTaiService.findById(+id);
    }


    @Roles('Giảng viên trưởng bộ môn')
    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.duyetDeTaiService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.duyetDeTaiService.delete(+id);
    }
}
