import { PartialType } from '@nestjs/mapped-types';
import { CreateTuongTacDto } from './create_tuong_tac.dto';

export class UpdateTuongTacDto extends PartialType(CreateTuongTacDto) { }
