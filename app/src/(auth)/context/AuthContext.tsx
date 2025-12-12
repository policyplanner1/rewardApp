"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: number;
  email: string;
  role: "vendor" | "vendor_manager" | "admin" | "warehouse_manager";
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: "vendor" | "vendor_manager" | "admin" | "warehouse_manager",
    phone?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto Login
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fix route mapping
  const resolveRoute = (role: string) => {
    if (role === "vendor") return "vendor";
    if (role === "vendor_manager") return "manager";
    if (role === "admin") return "admin";
    if (role === "warehouse_manager") return "warehouse_manager";
    return role;
  };

  /* ---------------- LOGIN ---------------- */
  const login = async (email: string, password: string, role: string) => {
    try {
      setLoading(true);
      setError(null);

      const route = resolveRoute(role);
       console.log("API URL:", `${API_URL}/${route}/login`);
      const response = await fetch(`${API_URL}/${route}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      const token = data.data.token;
      const loggedUser = data.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);

      if (loggedUser.role === "vendor") router.push("/src/vendor/dashboard");
      if (loggedUser.role === "vendor_manager") router.push("/src/manager/dashboard");
      if (loggedUser.role === "warehouse_manager") router.push("/src/warehouse/dashboard");
      if (loggedUser.role === "admin") router.push("/src/admin/dashboard");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REGISTER ---------------- */
  const register = async (
    email: string,
    password: string,
    role: "vendor" | "vendor_manager" | "admin" | "warehouse_manager",
    phone?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const route = resolveRoute(role);
   console.log("API URL:", `${API_URL}/${route}/register`);
      const response = await fetch(`${API_URL}/${route}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, phone })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      const token = data.data.token;
      const newUser = data.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);

      if (newUser.role === "vendor") router.push("/src/vendor/dashboard");
      if (newUser.role === "vendor_manager") router.push("/src/manager/dashboard");
      if (newUser.role === "warehouse_manager") router.push("/src/warehouse/dashboard");
      if (newUser.role === "admin") router.push("/src/admin/dashboard");

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/src/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}