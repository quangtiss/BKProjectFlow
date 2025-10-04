// auth-context.tsx
import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
    useContext
} from 'react';
import { toast } from 'sonner';

type AuthContextType = {
    isAuthenticated: any;
    loading: any;
    setIsAuthenticated: any;
    user: any;
    setUser: any;
    updateContext: boolean;
    setUpdateContext: any;
    refreshContext: any;
    badgeCount: number;
    setBadgeCount: any
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    setIsAuthenticated: () => { },
    user: null,
    setUser: () => { },
    updateContext: false,
    setUpdateContext: () => { },
    refreshContext: () => { },
    badgeCount: 0,
    setBadgeCount: () => { }
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [updateContext, setUpdateContext] = useState(false)


    const refreshContext = () => {
        setUpdateContext((prev) => !prev); // toggle để useEffect chạy lại
    };

    const [badgeCount, setBadgeCount] = useState(0);

    useEffect(() => {
        const isLogin = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/profile', {
                    method: 'GET',
                    credentials: 'include',
                })
                if (response.ok) {
                    const data = await response.json()
                    setIsAuthenticated(true)
                    setUser(data)
                }
                else {
                    setUser(null)
                    setIsAuthenticated(false)
                }
            } catch {
                setUser(null)
                setIsAuthenticated(false)
            } finally {
                setLoading(false)
            }

        }
        isLogin()
        setBadgeCount(0)
    }, [updateContext]);

    ;

    useEffect(() => {
        if (!user?.auth?.sub) return; // chưa login thì bỏ qua

        const fetchCountTbao = async () => {
            try {
                const res = await fetch('http://localhost:3000/tuong-tac/nguoi-dung/count?is_read=false', { method: 'GET', credentials: 'include' })
                const data = await res.text();
                setBadgeCount(Number(data));
            } catch (error) {
                console.error('Lỗi khi tính thông báo: ', error)
            }
        }
        fetchCountTbao()

        const eventSource = new EventSource(`http://localhost:3000/notifications/stream/${user.auth.sub}`, {
            withCredentials: true
        });

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // Cập nhật badge
            setBadgeCount((prev) => prev + 1);
            toast.success('Thông báo mới', { description: data.message })
        };

        return () => eventSource.close();
    }, [user]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated, user, setUser, refreshContext, badgeCount, setBadgeCount }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);