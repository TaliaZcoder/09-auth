'use client';

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  checkSession,
} from "@/lib/api/clientApi";

import {
  useAuthStore,
} from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({
  children,
}: Props) {
  const router = useRouter();
  const pathname =
    usePathname();

  const [loading, setLoading] =
    useState(true);

  const setUser =
    useAuthStore(
      (state) => state.setUser
    );

  const clearAuth =
    useAuthStore(
      (state) =>
        state.clearIsAuthenticated
    );

  useEffect(() => {
    const verify =
      async () => {
        try {
          const user =
            await checkSession();

          if (user) {
            setUser(user);
          } else {
            clearAuth();

            if (
              pathname.startsWith(
                "/profile"
              ) ||
              pathname.startsWith(
                "/notes"
              )
            ) {
              router.push(
                "/sign-in"
              );
            }
          }
        } catch {
          clearAuth();
        } finally {
          setLoading(false);
        }
      };

    verify();
  }, [
    pathname,
    router,
    setUser,
    clearAuth,
  ]);

  if (loading) {
    return (
      <p
        style={{
          padding: "40px",
        }}
      >
        Loading...
      </p>
    );
  }

  return children;
}