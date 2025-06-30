import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { DeTaiService } from './de_tai.service';
import { CreateDeTaiDTO } from './dto/create_de_tai.dto';

@Controller('de_tai')
export class DeTaiController {
    constructor(private readonly deTaiService: DeTaiService) { }

    @Post()
    create(@Body() createDeTai: CreateDeTaiDTO) {
        return this.deTaiService.create(createDeTai);
    }

    @Get()
    findAll() {
        return this.deTaiService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.deTaiService.findById(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.deTaiService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.deTaiService.delete(+id);
    }
}
