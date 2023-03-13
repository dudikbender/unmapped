// zustand store for notes

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNoteStore = create(
    persist(
        (set, get) => ({
            notes: [],
            addNote: (note) =>
                set((state) => ({
                    notes: [...state.notes, note]
                })),
            updateNote: (note) => {
                set((state) => ({
                    notes: state.notes.map((n) => (n.id === note.id ? note : n))
                }));
            },
            deleteNote: (id) => {
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id)
                }));
            }
        }),
        {
            name: "notes"
        }
    )
);
