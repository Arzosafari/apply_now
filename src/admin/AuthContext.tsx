import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Admin } from '@shared/types';
import { adminApi, setCsrfToken } from '@/lib/api';

interface AuthContextValue {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const result = await adminApi.session();
      if (!result.admin || !result.csrfToken) {
        setCsrfToken(null);
        setAdmin(null);
        return;
      }
      setCsrfToken(result.csrfToken);
      setAdmin(result.admin);
    } catch {
      setCsrfToken(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await adminApi.login(email, password);
    setCsrfToken(result.csrfToken);
    setAdmin(result.admin);
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } finally {
      setCsrfToken(null);
      setAdmin(null);
    }
  };

  const value = useMemo(
    () => ({ admin, loading, login, logout, refresh }),
    [admin, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return value;
}
