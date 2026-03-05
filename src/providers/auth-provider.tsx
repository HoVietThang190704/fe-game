"use client"

import React from "react";
import AuthService from "@/src/services/auth.service.impl";
import { LoginPayload, LoginResponse } from "@/src/lib/interface/login";

interface AuthContextType {
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<{ statusCode: number; body?: LoginResponse | null }>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await AuthService.login(payload);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthContext.Provider value={{ isLoading, login }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;