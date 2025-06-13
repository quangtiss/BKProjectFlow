import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TaiKhoanModule } from './modules/tai_khoan/TaiKhoan.module';

@Module({
  imports: [TaiKhoanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
