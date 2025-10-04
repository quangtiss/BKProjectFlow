import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationsService {
    private streams: Map<number, Subject<MessageEvent>> = new Map();

    createStream(userId: number): Subject<MessageEvent> {
        let subject = this.streams.get(userId);
        if (!subject) {
            subject = new Subject<MessageEvent>();
            this.streams.set(userId, subject);
        }
        return subject;
    }

    pushToUser(userId: number, data: any) {
        const subject = this.streams.get(userId);
        if (subject) {
            subject.next({ data });
        }
    }
}
