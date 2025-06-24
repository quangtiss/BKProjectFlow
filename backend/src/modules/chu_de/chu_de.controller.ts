import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ChuDeService } from './chu_de.service';

@Controller('chu_de')
export class ChuDeController {
    constructor(private readonly chuDeService: ChuDeService) { }

    @Post()
    create(@Body() body) {
        return this.chuDeService.create(body);
    }

    @Get()
    findAll() {
        return this.chuDeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.chuDeService.findById(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.chuDeService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.chuDeService.delete(+id);
    }
}
