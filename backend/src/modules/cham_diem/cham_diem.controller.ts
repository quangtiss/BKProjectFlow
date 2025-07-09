import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ChamDiemService } from './cham_diem.service';

@Controller('cham-diem')
export class ChamDiemController {
    constructor(private readonly chamDiemService: ChamDiemService) { }

    @Post()
    create(@Body() body) {
        return this.chamDiemService.create(body);
    }

    @Get()
    findAll() {
        return this.chamDiemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.chamDiemService.findById(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.chamDiemService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.chamDiemService.delete(+id);
    }
}
