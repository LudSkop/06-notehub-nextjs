"use client";

import css from "@/app/notes/page.module.css";
import { NoteList } from "@/components/NoteList/NoteList";

import { keepPreviousData } from "@tanstack/react-query";
import Pagination from "@/components/Pagination/Pagination";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";

export default function App() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // ✅ скидає сторінку при новому пошуку
  }, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, search], // ключ з номером сторінки
    queryFn: () => fetchNotes({ page, search }), // передаємо номер сторінки
    placeholderData: keepPreviousData,
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <p>Error</p>;
  const notes = data?.notes ?? [];

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox
            value={inputValue}
            onChange={(value) => {
              setInputValue(value);
              debouncedSearch(value);
            }}
          />
          {data && data.totalPages > 1 && (
            <Pagination
              totalPages={data.totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <NoteForm onClose={() => setIsModalOpen(false)} />
            </Modal>
          )}
        </header>

        {notes.length > 0 && <NoteList notes={notes} />}
      </div>
    </>
  );
}
