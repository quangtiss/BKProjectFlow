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
    setUser: (value: object | null) => void
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    setIsAuthenticated: () => { },
    user: null,
    setUser: () => { }
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<object | null>(null);

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
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);