import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TuongTacService } from './tuong_tac.service';
import { CreateTuongTacDto } from './dto/create_tuong_tac.dto';
import { UpdateTuongTacDto } from './dto/update_tuong_tac.dto';

@Controller('tuong-tac')
export class TuongTacController {
  constructor(private readonly tuongTacService: TuongTacService) { }

  @Post()
  create(@Body() createTuongTacDto: CreateTuongTacDto) {
    return this.tuongTacService.create(createTuongTacDto);
  }

  @Get()
  findAll() {
    return this.tuongTacService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tuongTacService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTuongTacDto: UpdateTuongTacDto) {
    return this.tuongTacService.update(+id, updateTuongTacDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tuongTacService.remove(+id);
  }
}
