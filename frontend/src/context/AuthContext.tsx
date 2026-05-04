import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { tokenStore } from "../lib/tokenStore";
import type { User } from "../types";

type AuthResponse = {
  accessToken: string;
  user: User;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setSession = (payload: AuthResponse) => {
    tokenStore.set(payload.accessToken);
    setUser(payload.user);
  };

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password
    });
    setSession(response.data);
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/signup", {
      name,
      email,
      password
    });
    setSession(response.data);
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const bootstrap = async () => {
      const token = tokenStore.get();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<User>("/auth/me");
        setUser(response.data);
      } catch {
        tokenStore.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
