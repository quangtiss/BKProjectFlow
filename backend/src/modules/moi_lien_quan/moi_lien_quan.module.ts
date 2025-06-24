import { Module } from '@nestjs/common';
import { MoiLienQuanService } from './moi_lien_quan.service';
import { MoiLienQuanController } from './moi_lien_quan.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MoiLienQuanController],
  providers: [MoiLienQuanService],
})
export class MoiLienQuanModule { }
