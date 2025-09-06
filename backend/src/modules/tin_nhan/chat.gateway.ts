import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // bật CORS cho FE gọi được
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    // Khi client kết nối socket
    handleConnection(socket: Socket) {
        const userId = socket.handshake.query.userId; // nhận userId từ FE
        socket.data.userId = userId;
        socket.join(`user:${userId}`);
    }

    // Khi client join vào conversation
    @SubscribeMessage('joinConversation')
    handleJoinConversation(socket: Socket, conversationId: number) {
        socket.join(`conversation:${conversationId}`);
        return { success: true, conversationId };
    }

    // Khi client gửi tin nhắn
    @SubscribeMessage('sendMessage')
    handleSendMessage(
        socket: Socket,
        payload: { conversationId: number; content: string },
    ) {
        const message = {
            id: Date.now(), // tạm ID giả
            conversationId: payload.conversationId,
            senderId: socket.data.userId,
            content: payload.content,
            createdAt: new Date(),
        };

        // Emit cho tất cả client trong conversation này
        this.server.to(`conversation:${payload.conversationId}`).emit('newMessage', message);

        return message;
    }
}
