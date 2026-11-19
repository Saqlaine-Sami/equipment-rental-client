"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch, clearToken, getToken, requestToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // আমাদের Server থেকে user-এর তথ্য ও role আনে
  const loadUser = useCallback(async (email) => {
    try {
      if (!getToken()) await requestToken(email);

      try {
        return await apiFetch("/users/me");
      } catch (error) {
        // Token পুরোনো বা ভুল হলে নতুন token নিয়ে আবার চেষ্টা
        if (error.status === 401) {
          await requestToken(email);
          return await apiFetch("/users/me");
        }
        throw error;
      }
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    // Login নেই
    if (!session) {
      setUser(null);
      clearToken();
      setLoadingUser(false);
      return;
    }

    let active = true;
    setLoadingUser(true);
    loadUser(session.user.email).then((appUser) => {
      if (active) {
        setUser((current) => appUser ?? current);
        setLoadingUser(false);
      }
    });
    return () => {
      active = false;
    };
  }, [session, isPending, loadUser]);

  // Register / Login শেষে হাতে হাতে তথ্য নতুন করে আনার জন্য
  const refreshUser = useCallback(
    async (email) => {
      setLoadingUser(true);
      const appUser = await loadUser(email);
      setUser(appUser);
      setLoadingUser(false);
      return appUser;
    },
    [loadUser]
  );

  const logout = useCallback(async () => {
    await authClient.signOut();
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading: isPending || loadingUser, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);