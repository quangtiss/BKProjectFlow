import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { HocKiService } from './hoc_ki.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('hoc_ki')
export class HocKiController {
    constructor(private readonly hocKiService: HocKiService) { }

    @Post()
    create(@Body() body) {
        return this.hocKiService.create(body);
    }

    @Get()
    findAll() {
        return this.hocKiService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.hocKiService.findById(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.hocKiService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hocKiService.delete(+id);
    }
}
