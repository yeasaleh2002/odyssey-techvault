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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const data = await getMe();
      if (data.success) {
        setUser(data.data);
        const token = getAccessToken();
        if (token) setAccessToken(token);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user profile", error);
      setUser(null);
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
      setAccessToken(data.accessToken);
      setMemoryToken(data.accessToken);
      setUser(data.user);
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name: string, role?: string, adminSecret?: string) => {
    // Send to backend
    const data = await registerUser({ email, password, name, role, adminSecret });
    if (data.success) {
      setAccessToken(data.accessToken);
      setMemoryToken(data.accessToken);
      setUser(data.user);
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
    setAccessToken(null);
    setMemoryToken('');
    setUser(null);
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
