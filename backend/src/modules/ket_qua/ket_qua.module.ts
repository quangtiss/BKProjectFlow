import { Module } from '@nestjs/common';
import { KetQuaService } from './ket_qua.service';
import { KetQuaController } from './ket_qua.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KetQuaController],
  providers: [KetQuaService],
})
export class KetQuaModule { }
