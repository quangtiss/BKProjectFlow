import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UtilsController],
  providers: [UtilsService],
  exports: [UtilsService]
})
export class UtilsModule { }
