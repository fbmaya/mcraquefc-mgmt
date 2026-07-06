import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ApiError, clearToken, getToken, loginRequest, setToken } from '../api/client';
import type { TokenResponse } from '../api/types';

interface AuthUser {
  id: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const USER_KEY = 'mcraquefc_mgmt_user';

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw || !getToken()) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // keep tab in sync if the token is cleared elsewhere (e.g. a 401)
    const onStorage = () => setUser(readStoredUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        setLoading(true);
        try {
          const res: TokenResponse = await loginRequest(email, password);
          // The panel is exclusive to the platform team.
          if (res.role !== 'platform_admin') {
            throw new ApiError(403, 'Acesso exclusivo para administradores da plataforma');
          }
          setToken(res.access_token);
          const nextUser: AuthUser = { id: res.user_id, name: res.name };
          localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
          setUser(nextUser);
        } finally {
          setLoading(false);
        }
      },
      logout() {
        clearToken();
        localStorage.removeItem(USER_KEY);
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
