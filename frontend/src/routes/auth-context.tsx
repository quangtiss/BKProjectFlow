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
    role: string | null;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    setIsAuthenticated: () => { },
    role: null
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);

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
                    setRole(data.auth.role)
                }
                else {
                    setRole(null)
                    setIsAuthenticated(false)
                }
            } catch {
                setRole(null)
                setIsAuthenticated(false)
            } finally {
                setLoading(false)
            }

        }
        isLogin()
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated, role }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);