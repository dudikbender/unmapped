// zustand store for user connections

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useConnectionStore = create(
    persist(
        (set, get) => ({
            connections: [],
            setConnectionsInStore: (connections) => set({ connections }),
            addConnectionToStore: (connection) =>
                set((state) => ({
                    connections: [...state.connections, connection]
                })),
            updateConnectionInStore: (connection) => {
                set((state) => ({
                    connections: state.connections.map((c) =>
                        c.uuid === connection.uuid ? connection : c
                    )
                }));
            },
            deleteConnectionInStore: (id) => {
                set((state) => ({
                    connections: state.connections.filter(
                        (connection) => connection.uuid !== uuid
                    )
                }));
            }
        }),
        {
            name: "connections"
        }
    )
);
