'use client';

import { useEffect, useState } from "react";

import {
  checkSession,
  getMe,
} from "@/lib/api/clientApi";

import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({
  children,
}: Props) {
  const [loading, setLoading] =
    useState(true);

  const {
    setUser,
    clearIsAuthenticated,
  } = useAuthStore();

  useEffect(() => {
    async function verifyAuth() {
      try {
        const session =
          await checkSession();

        if (session.data) {
          const user =
            await getMe();

          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    }

    verifyAuth();
  }, [setUser, clearIsAuthenticated]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}