"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

type AuthContextProviderProps = {
  children: React.ReactNode;
};

type AuthContext = {
  isLoggedIn: boolean;
  role: string | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  checkAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/checkAuth");
      const data = await response.json();
      setIsLoggedIn(data.success);
      if (data.success && data.role) {
        setRole(data.role);
      } else {
        setRole(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoggedIn(false);
      setRole(null);
    }
  };

  const getNextNoon = () => {
    const now = new Date();
    const nextNoon = new Date(now);
    nextNoon.setHours(19,27,0);
    if (now >= nextNoon) {
      nextNoon.setDate(nextNoon.getDate() + 1);
    }
    return nextNoon;
  };

  useEffect(() => {
    checkAuth();

    const nextNoon = getNextNoon();
    const timeout = window.setTimeout(async () => {
      try {
        await fetch("/api/logout", { method: "POST" });
      } finally {
        setIsLoggedIn(false);
        setRole(null);
        window.location.href = "/auth/signin";
      }
    }, nextNoon.getTime() - Date.now());

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, setIsLoggedIn, setRole, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider",
    );
  }
  return context;
}
