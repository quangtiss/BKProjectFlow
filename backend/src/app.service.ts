import { Injectable } from '@nestjs/common';
import { NotificationsService } from './modules/notifications/notifications.service';

@Injectable()
export class AppService {
  constructor(private readonly notificationService: NotificationsService) { }
  getHello(): string {
    this.notificationService.pushToUser(1, { message: "Đề tài của bạn đã được duyệt" })
    return 'Hello World!';
  }
}
