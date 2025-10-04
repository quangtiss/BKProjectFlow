// excel.controller.ts
import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { excelUploadConfig } from './excel-upload.config';
import { ExcelService } from './excel.service';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('excel')
export class ExcelController {
    constructor(private readonly excelService: ExcelService) { }

    @Roles('Giáo vụ')
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', excelUploadConfig))
    async uploadExcel(@UploadedFile() file, @Body('role') role) {
        if (!file) return { message: 'No file uploaded' };

        await this.excelService.processExcel(file.path, role);

        return { message: 'Excel processed successfully' };
    }
}
