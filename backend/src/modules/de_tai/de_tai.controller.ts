import { Controller, Get, Post, Patch, Delete, Body, Param, Request, Query } from '@nestjs/common';
import { DeTaiService } from './de_tai.service';
import { CreateDeTaiDTO } from './dto/create_de_tai.dto';
import { UpdateTrangThaiDTO } from './dto/update_de_tai_trang_thaidto';
import { QueryDeTai } from './dto/query_de_tai.dto';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('de-tai')
export class DeTaiController {
    constructor(private readonly deTaiService: DeTaiService) { }

    @Roles('Sinh viên', 'Giảng viên', 'Giảng viên trưởng bộ môn')
    @Post()
    create(@Body() createDeTai: CreateDeTaiDTO, @Request() req) {
        const user = req.user
        return this.deTaiService.create(createDeTai, user);
    }

    @Get()
    findAll(@Query() query: QueryDeTai) {
        return this.deTaiService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.deTaiService.findById(+id);
    }


    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.deTaiService.update(+id, body);
    }

    @Patch('/trang-thai/:id')
    updateTrangThai(@Param('id') id: string, @Body() updateTrangThaiData: UpdateTrangThaiDTO) {
        return this.deTaiService.update(+id, updateTrangThaiData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.deTaiService.delete(+id);
    }
}
