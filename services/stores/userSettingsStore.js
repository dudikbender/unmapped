import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
    persist(
        (set, get) => ({
            settings: [],
            setSettingsInStore: (settings) => set({ settings }),
            updateSettingInStore: (setting, property, value) => {
                set((state) => ({
                    notes: state.settings.map((s) =>
                        s.uuid === setting.uuid
                            ? (setting[property] = value)
                            : n
                    )
                }));
            }
        }),
        {
            name: "settings"
        }
    )
);
