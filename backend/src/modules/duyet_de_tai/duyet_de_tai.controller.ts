import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { DuyetDeTaiService } from './duyet_de_tai.service';

@Controller('duyet_de_tai')
export class DuyetDeTaiController {
    constructor(private readonly duyetDeTaiService: DuyetDeTaiService) { }

    @Post()
    create(@Body() body) {
        return this.duyetDeTaiService.create(body);
    }

    @Get()
    findAll() {
        return this.duyetDeTaiService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.duyetDeTaiService.findById(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.duyetDeTaiService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.duyetDeTaiService.delete(+id);
    }
}
