// auth-context.tsx
import {
    createContext,
    useEffect,
    useState,
    ReactNode,
    useContext
} from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    loading: boolean;
    setIsAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    setIsAuthenticated: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isLogin = async () => {
            try {
                const response = await fetch('http://localhost:3000', {
                    method: 'GET',
                    credentials: 'include',
                })
                if (response.ok) setIsAuthenticated(true)
                else setIsAuthenticated(false)
            } catch {
                setIsAuthenticated(false)
            } finally {
                setLoading(false)
            }

        }
        isLogin()
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);