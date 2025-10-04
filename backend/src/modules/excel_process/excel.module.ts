// excel.module.ts
import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ExcelController],
    providers: [ExcelService],
})
export class ExcelModule { }
