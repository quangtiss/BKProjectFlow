import { Module } from '@nestjs/common';
import { ChinhSuaService } from './chinh_sua.service';
import { ChinhSuaController } from './chinh_sua.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChinhSuaController],
  providers: [ChinhSuaService],
})
export class ChinhSuaModule { }
