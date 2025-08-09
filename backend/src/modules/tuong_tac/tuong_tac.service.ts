import { Injectable } from '@nestjs/common';
import { CreateTuongTacDto } from './dto/create_tuong_tac.dto';
import { UpdateTuongTacDto } from './dto/update_tuong_tac.dto';

@Injectable()
export class TuongTacService {
  create(createTuongTacDto: CreateTuongTacDto) {
    return 'This action adds a new tuongTac';
  }

  findAll() {
    return `This action returns all tuongTac`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tuongTac`;
  }

  update(id: number, updateTuongTacDto: UpdateTuongTacDto) {
    return `This action updates a #${id} tuongTac`;
  }

  remove(id: number) {
    return `This action removes a #${id} tuongTac`;
  }
}
