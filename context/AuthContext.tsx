"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/types";
import { toast } from "react-hot-toast";
import { loginUser, registerUser, logoutUser, getMe } from "@/lib/services/auth";
import { setAccessToken as setMemoryToken, getAccessToken } from "@/lib/api";
import { auth, googleProvider } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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
    // 1. Login with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUid = userCredential.user.uid;

    // 2. Send to backend
    const data = await loginUser({ email, password, firebaseUid });
    if (data.success) {
      setAccessToken(data.accessToken);
      setMemoryToken(data.accessToken);
      setUser(data.user);
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    // 1. Create user via Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUid = userCredential.user.uid;

    // 2. Send to backend
    const data = await registerUser({ email, password, name, firebaseUid });
    if (data.success) {
      setAccessToken(data.accessToken);
      setMemoryToken(data.accessToken);
      setUser(data.user);
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      const email = firebaseUser.email || '';
      const firebaseUid = firebaseUser.uid;
      const name = firebaseUser.displayName || 'Google User';
      
      // Try to login first
      try {
        const loginData = await loginUser({ email, firebaseUid });
        if (loginData.success) {
          setAccessToken(loginData.accessToken);
          setMemoryToken(loginData.accessToken);
          setUser(loginData.user);
          return;
        }
      } catch (loginError: any) {
        // If 401/400, it might mean user doesn't exist in backend yet, fallback to register
        if (loginError.response?.status === 401 || loginError.response?.status === 400) {
          // Generate a secure random password since backend requires it
          const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
          const regData = await registerUser({ name, email, password: randomPassword, firebaseUid });
          if (regData.success) {
            setAccessToken(regData.accessToken);
            setMemoryToken(regData.accessToken);
            setUser(regData.user);
            return;
          }
        }
        throw loginError;
      }
    } catch (error) {
      console.error("Google login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Firebase Signout
      await signOut(auth);
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
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, loginWithGoogle, logout, fetchCurrentUser }}>
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
