import { Controller, Post, Get, Body } from '@nestjs/common';
import { DeTaiService } from './de_tai.service';

@Controller('de_tai')
export class DeTaiController {
    constructor(private readonly deTaiService: DeTaiService) { }

    @Get()
    async findAll() {
        return await this.deTaiService.findAll();
    }


    @Post()
    async create(@Body() body) {
        return await this.deTaiService.create(body);
    }
}
