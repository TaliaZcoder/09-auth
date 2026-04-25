import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";

import { api } from "./api";

import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
) : Promise<FetchNotesResponse> => {
  const cookie = await getCookieHeader();

  const res =
    await api.get<FetchNotesResponse>(
      "/notes",
      {
        params: {
          page,
          perPage: 12,
          search,
          ...(tag ? { tag } : {}),
        },
        headers: {
          Cookie: cookie,
        },
      }
    );

  return res.data;
}

export const fetchNoteById = async (
  id: string
) : Promise<Note> => {
  const cookie = await getCookieHeader();

  const res = await api.get<Note>(
    `/notes/${id}`,
    {
      headers: {
        Cookie: cookie,
      },
    }
  );

  return res.data;
}


export const getMe =
  async () : Promise<User> => {
  const cookie = await getCookieHeader();

  const res = await api.get<User>(
    "/users/me",
    {
      headers: {
        Cookie: cookie,
      },
    }
  );

  return res.data;
}


export const checkSession =
  async () : Promise<
  AxiosResponse<User | null>
> => {
  const cookie = await getCookieHeader();

  const res = await api.get<User | null>(
    "/auth/session",
    {
      headers: {
        Cookie: cookie,
      },
    }
  );

  return res;
}