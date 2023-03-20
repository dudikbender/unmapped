import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNoteReadStore = create(
    persist(
        (set, get) => ({
            noteReads: [],
            setNoteReadsInStore: (noteReads) => set({ noteReads }),
            addNoteReadToStore: (noteRead) =>
                set((state) => ({
                    noteReads: [...state.noteReads, noteRead]
                })),
            updateNoteReadInStore: (noteRead) => {
                set((state) => ({
                    noteReads: state.noteReads.map((n) =>
                        n?.note_id === noteRead?.note_id ? noteRead : n
                    )
                }));
            },
            modifyStarredInStore: (noteRead) => {
                set((state) => ({
                    noteReads: state.noteReads.map((n) =>
                        n.uuid === noteRead.uuid
                            ? { ...n, starred: !n.starred }
                            : n
                    )
                }));
            },
            deleteNoteReadInStore: (uuid) => {
                set((state) => ({
                    noteReads: state.noteReads.filter((n) => n.uuid !== uuid)
                }));
            }
        }),
        {
            name: "noteReads"
        }
    )
);
