import { Controller, Get, Post, Patch, Delete, Body, Param, Request, Query } from '@nestjs/common';
import { DeTaiService } from './de_tai.service';
import { CreateDeTaiDTO } from './dto/create_de_tai.dto';
import { UpdateTrangThaiDTO } from './dto/update_de_tai_trang_thaidto';

@Controller('de_tai')
export class DeTaiController {
    constructor(private readonly deTaiService: DeTaiService) { }

    @Post()
    create(@Body() createDeTai: CreateDeTaiDTO, @Request() req) {
        const user = req.user
        return this.deTaiService.create(createDeTai, user);
    }

    @Get()
    findAll(@Query() query: { trang_thai?: string, trang_thai_duyet?: string }) {
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

    @Patch('/trang_thai/:id')
    updateTrangThai(@Param('id') id: string, @Body() updateTrangThaiData: UpdateTrangThaiDTO) {
        return this.deTaiService.update(+id, updateTrangThaiData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.deTaiService.delete(+id);
    }
}
