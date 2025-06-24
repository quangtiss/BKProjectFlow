import { Module } from '@nestjs/common';
import { ChuDeService } from './chu_de.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ChuDeController } from './chu_de.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ChuDeController],
  providers: [ChuDeService]
})
export class ChuDeModule { }
