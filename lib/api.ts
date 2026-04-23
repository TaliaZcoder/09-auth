import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: NoteTag;
}

/* NOTES */

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  const res = await axios.get("/notes", {
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
): Promise<Note> => {
  const res = await axios.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (
  note: CreateNoteRequest
): Promise<Note> => {
  const res = await axios.post("/notes", note);
  return res.data;
};

export const deleteNote = async (
  id: string
): Promise<Note> => {
  const res = await axios.delete(`/notes/${id}`);
  return res.data;
};

/* AUTH */

export const registerUser = async (
  email: string,
  password: string
) => {
  const res = await axios.post("/auth/register", {
    email,
    password,
  });

  return res.data;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const res = await axios.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};

export const logoutUser = async () => {
  await axios.post("/auth/logout");
};

export const getSession = async () => {
  const res = await axios.get("/auth/session");
  return res.data;
};

export const getMe = async () => {
  const res = await axios.get("/users/me");
  return res.data;
};

export const updateMe = async (data: {
  username?: string;
}) => {
  const res = await axios.patch("/users/me", data);
  return res.data;
};