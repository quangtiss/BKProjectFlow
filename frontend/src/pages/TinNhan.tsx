import { useChat } from "@/hooks/useChat";
import { useState } from "react";


export default function TinNhan({ conversationId }: { conversationId: number }) {
    const { messages, sendMessage } = useChat(conversationId);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    return (
        <div className="flex flex-col h-full border rounded-lg">
            <div className="flex-1 overflow-y-auto p-2">
                {messages.map((m) => (
                    <div key={m.id} className="mb-2">
                        <b>{m.senderId}:</b> {m.content}
                    </div>
                ))}
            </div>
            <div className="flex p-2 border-t">
                <input
                    className="flex-1 border rounded px-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                />
                <button
                    onClick={handleSend}
                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}
