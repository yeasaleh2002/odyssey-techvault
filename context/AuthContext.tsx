"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/types";
import { toast } from "react-hot-toast";
import { loginUser, registerUser, logoutUser, getMe } from "@/lib/services/auth";
import { setAccessToken as setMemoryToken, getAccessToken } from "@/lib/api";


interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: string, adminSecret?: string) => Promise<void>;

  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on first render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('odyssey-user');
      const storedToken = localStorage.getItem('odyssey-token');
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setAccessTokenState(storedToken);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const data = await getMe();
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('odyssey-user', JSON.stringify(data.data));
        const token = getAccessToken();
        if (token) {
          setAccessTokenState(token);
          localStorage.setItem('odyssey-token', token);
        }
      } else {
        setUser(null);
        localStorage.removeItem('odyssey-user');
      }
    } catch (error: any) {
      // Only log non-401 errors, as 401 just means the user's session expired
      if (error?.response?.status !== 401) {
        console.error("Error loading user profile", error);
      }
      setUser(null);
      localStorage.removeItem('odyssey-user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt to load current user on mount
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Send to backend
    const data = await loginUser({ email, password });
    if (data.success) {
      setAccessTokenState(data.accessToken);
      setMemoryToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('odyssey-user', JSON.stringify(data.user));
      localStorage.setItem('odyssey-token', data.accessToken);
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name: string, role?: string, adminSecret?: string) => {
    // Send to backend
    const data = await registerUser({ email, password, name, role, adminSecret });
    if (data.success) {
      setAccessTokenState(data.accessToken);
      setMemoryToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('odyssey-user', JSON.stringify(data.user));
      localStorage.setItem('odyssey-token', data.accessToken);
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  };
  const logout = async () => {
    try {
      // Backend Signout
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    }
    setAccessTokenState(null);
    setMemoryToken('');
    setUser(null);
    localStorage.removeItem('odyssey-user');
    localStorage.removeItem('odyssey-token');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
