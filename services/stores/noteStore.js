// zustand store for notes

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNoteStore = create(
    persist(
        (set, get) => ({
            notes: [],
            setNotesInStore: (notes) => set({ notes }),
            addNoteToStore: (note) =>
                set((state) => ({
                    notes: [...state.notes, note]
                })),
            updateNoteInStore: (note) => {
                set((state) => ({
                    notes: state.notes.map((n) =>
                        n.uuid === note.uuid ? note : n
                    )
                }));
            },
            deleteNoteInStore: (uuid) => {
                set((state) => ({
                    notes: state.notes.filter((note) => note.uuid !== uuid)
                }));
            }
        }),
        {
            name: "notes"
        }
    )
);
