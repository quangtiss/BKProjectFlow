import { useEffect, useState, useCallback } from "react";
import { useSocket } from "./useSocket";

export function useChat(conversationId: number) {
    const socket = useSocket();
    const [messages, setMessages] = useState<any[]>([]);

    // tạo handler cố định, không thay đổi reference mỗi render
    const handleNewMessage = useCallback(
        (msg: any) => {
            if (msg.conversationId === conversationId) {
                setMessages((prev) => [...prev, msg]);
            }
        },
        [conversationId]
    );

    useEffect(() => {
        if (!conversationId || !socket) return;

        socket.emit("joinConversation", conversationId);

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [conversationId, socket, handleNewMessage]);

    const sendMessage = (content: string) => {
        if (socket) {
            socket.emit("sendMessage", { conversationId, content });
        }
    };

    return { messages, sendMessage };
}
