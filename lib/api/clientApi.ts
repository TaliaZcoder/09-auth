import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface RegisterRequest {
  email: string;
  password: string;
}

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  const res = await api.get("/notes", {
    params: {
      page,
      perPage: 12,
      search,
      ...(tag ? { tag } : {}),
    },
  });

  return res.data;
};

export const fetchNoteById = async (
  id: string
) => {
  const res = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (
  note: {
    title: string;
    content: string;
    tag: string;
  }
) => {
  const res = await api.post(
    "/notes",
    note
  );

  return res.data;
};

export const deleteNote = async (
  id: string
) => {
  const res = await api.delete(
    `/notes/${id}`
  );

  return res.data;
};

export const register = async (
  data: RegisterRequest
): Promise<User> => {
  const res = await api.post(
    "/auth/register",
    data
  );

  return res.data;
};

export const login = async (
  data: {
    email: string;
    password: string;
  }
) => {
  const res = await api.post(
    "/auth/login",
    data
  );

  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const checkSession =
  async () => {
    const res = await api.get(
      "/auth/session"
    );

    return res.data;
  };

export const getMe =
  async () => {
    const res = await api.get(
      "/users/me"
    );

    return res.data;
  };

export const updateMe = async (
  data: unknown
) => {
  const res = await api.patch(
    "/users/me",
    data
  );

  return res.data;
};