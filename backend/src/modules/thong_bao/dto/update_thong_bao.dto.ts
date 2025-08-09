import { PartialType } from '@nestjs/mapped-types';
import { CreateThongBaoDto } from './create_thong_bao.dto';

export class UpdateThongBaoDto extends PartialType(CreateThongBaoDto) { }
