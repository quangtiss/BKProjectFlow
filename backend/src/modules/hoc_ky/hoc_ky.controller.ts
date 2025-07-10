import { Controller, Get, Post, Patch, Delete, Body, Param, Request } from '@nestjs/common';
import { HocKyService } from './hoc_ky.service';
import { Roles } from '../auth/guard/roles.decorator';
import { CreateHocKyDTO } from './dto/create_hoc_ky.dto';

@Controller('hoc-ky')
export class HocKyController {
    constructor(private readonly HocKyService: HocKyService) { }

    @Roles("Giáo vụ")
    @Post()
    create(@Body() dataHocKy: CreateHocKyDTO, @Request() req) {
        const idNguoiThem = req.user.sub
        return this.HocKyService.create(dataHocKy, idNguoiThem);
    }

    @Get()
    findAll() {
        return this.HocKyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.HocKyService.findById(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.HocKyService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.HocKyService.delete(+id);
    }
}
