'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import css from "./EditProfilePage.module.css";

import {
  getMe,
  updateMe,
} from "@/lib/api/clientApi";

export default function EditProfilePage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [avatar, setAvatar] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadUser =
      async () => {
        try {
          const user =
            await getMe();

          setUsername(
            user.username
          );

          setEmail(user.email);

          setAvatar(
            user.avatar
          );
        } catch {
          setError(
            "Failed to load profile"
          );
        } finally {
          setLoading(false);
        }
      };

    loadUser();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await updateMe({
        username,
      });

      router.push(
        "/profile"
      );

      router.refresh();

    } catch {
      setError(
        "Failed to update profile"
      );
    }
  };

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>
          Edit Profile
        </h1>

        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form
          onSubmit={handleSubmit}
          className={css.profileInfo}
        >
          <div
            className={
              css.usernameWrapper
            }
          >
            <label htmlFor="username">
              Username:
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              className={css.input}
            />
          </div>

          <p>
            Email: {email}
          </p>

          <div
            className={css.actions}
          >
            <button
              type="submit"
              className={
                css.saveButton
              }
            >
              Save
            </button>

            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className={
                css.cancelButton
              }
            >
              Cancel
            </button>
          </div>

          {error && (
            <p className={css.error}>
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}