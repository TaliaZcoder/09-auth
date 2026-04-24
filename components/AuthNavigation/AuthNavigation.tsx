'use client';

import Link from "next/link";
import css from "../AuthNavigation/AuthNavigation.module.css";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthNavigation() {
  const { user, isAuthenticated } = useAuthStore();

  const router = useRouter();

  const clearIsAuthenticated =
    useAuthStore(
      (state) =>
        state.clearIsAuthenticated
    );

  const handleLogout = async () => {
    try {
      await logout();

      clearIsAuthenticated();

      router.push("/sign-in");
      router.refresh();

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
       {!isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>
               {user?.email}
            </p>

            <button className={css.logoutButton}
                onClick={handleLogout}
              >
              Logout
            </button>
          </li>
          </>
      )}
    </>
  );
};