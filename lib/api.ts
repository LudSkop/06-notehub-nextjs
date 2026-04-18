import axios from "axios";

import type { CreateNotePayload, Note } from "../types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api/notes";

const authHeader = {
  Authorization: `Bearer ${token}`,
};

export interface FetchNotesParams {
  page?: number;
  search?: string;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(BASE_URL, {
    params: {
      perPage: 12,
      page: params.page ?? 1,
      ...(params.search && { search: params.search }),
    },
    headers: authHeader,
  });

  return response.data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const response = await axios.post<Note>(BASE_URL, note, {
    headers: authHeader,
  });

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, {
    headers: authHeader,
  });
  return response.data;
};
