import { Controller, Get, Post, Patch, Delete, Body, Param, Request } from '@nestjs/common';
import { HocKiService } from './hoc_ky.service';
import { Roles } from '../auth/guard/roles.decorator';
import { CreateHocKiDTO } from './dto/create_hoc_ky.dto';

@Controller('hoc-ky')
export class HocKiController {
    constructor(private readonly hocKiService: HocKiService) { }

    @Roles("Giáo vụ")
    @Post()
    create(@Body() dataHocKi: CreateHocKiDTO, @Request() req) {
        const idNguoiThem = req.user.sub
        return this.hocKiService.create(dataHocKi, idNguoiThem);
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
