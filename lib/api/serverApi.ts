import { cookies } from "next/headers";
import { api } from "./api";

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
) => {
  const cookieStore =
    await cookies();

  const res = await api.get(
    "/notes",
    {
      params: {
        page,
        perPage: 12,
        search,
        ...(tag
          ? { tag }
          : {}),
      },

      headers: {
        Cookie:
          cookieStore.toString(),
      },
    }
  );

  return res.data;
};

export const fetchNoteById =
  async (id: string) => {
    const cookieStore =
      await cookies();

    const res = await api.get(
      `/notes/${id}`,
      {
        headers: {
          Cookie:
            cookieStore.toString(),
        },
      }
    );

    return res.data;
  };

export const getMe =
  async () => {
    const cookieStore =
      await cookies();

    const res = await api.get(
      "/users/me",
      {
        headers: {
          Cookie:
            cookieStore.toString(),
        },
      }
    );

    return res.data;
  };

export const checkSession =
  async () => {
    const cookieStore =
      await cookies();

    const res = await api.get(
      "/auth/session",
      {
        headers: {
          Cookie:
            cookieStore.toString(),
        },
      }
    );

    return res.data;
  };