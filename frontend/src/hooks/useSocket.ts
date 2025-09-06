import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/routes/auth-context";

let globalSocket: Socket | null = null;

export function useSocket() {
    const { user }: { user: any } = useAuth();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (user?.auth?.sub && !globalSocket) {
            globalSocket = io("http://localhost:3000", {
                query: { userId: user.auth.sub },
            });
        }

        socketRef.current = globalSocket;

        return () => {
            // ❌ KHÔNG disconnect ở đây
            // socket chỉ nên disconnect khi user logout
        };
    }, [user]);

    return socketRef.current;
}
