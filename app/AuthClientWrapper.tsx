'use client';

import { AuthProvider } from "./src/(auth)/context/AuthContext";


export default function AuthClientWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
