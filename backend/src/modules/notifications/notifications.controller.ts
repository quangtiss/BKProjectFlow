import { Controller, Param, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Sse('stream/:userId')
    stream(@Param('userId') userId: number) {
        const subject = this.notificationsService.createStream(userId);
        return subject.asObservable();
    }
}
