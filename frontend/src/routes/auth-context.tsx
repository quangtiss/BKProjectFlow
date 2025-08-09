// auth-context.tsx
import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
    useContext
} from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    loading: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: object | null;
    setUser: (value: object | null) => void;
    notifications: object | null;
    setNotifications: (value: object | null) => void;
    updateContext: boolean;
    setUpdateContext: (updater: (value: boolean) => boolean) => void;
    refreshContext: () => void;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    setIsAuthenticated: () => { },
    user: null,
    setUser: () => { },
    notifications: null,
    setNotifications: () => { },
    updateContext: false,
    setUpdateContext: () => { },
    refreshContext: () => { }
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<object | null>(null);
    const [notifications, setNotifications] = useState<object | null>(null)
    const [updateContext, setUpdateContext] = useState(false)


    const refreshContext = () => {
        setUpdateContext((prev) => !prev); // toggle để useEffect chạy lại
    };

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

                    const response2 = await fetch('http://localhost:3000/thong-bao/count-all', {
                        method: 'GET',
                        credentials: 'include'
                    })
                    if (response2.ok) {
                        setNotifications(await response2.json())
                    }
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
    }, [updateContext]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated, user, setUser, notifications, setNotifications, refreshContext }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);