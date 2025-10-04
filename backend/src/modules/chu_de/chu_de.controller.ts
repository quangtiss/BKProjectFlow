import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ChuDeService } from './chu_de.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('chu-de')
export class ChuDeController {
    constructor(private readonly chuDeService: ChuDeService) { }

    @Roles('Giáo vụ')
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

    @Roles('Giáo vụ')
    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.chuDeService.update(+id, body);
    }

    @Roles('Giáo vụ')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.chuDeService.delete(+id);
    }
}
