import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ThongBaoService } from './thong_bao.service';
import { Public } from '../auth/guard/public.decorator';

@Controller('thong-bao')
export class ThongBaoController {
  constructor(private readonly thongBaoService: ThongBaoService) { }


}
