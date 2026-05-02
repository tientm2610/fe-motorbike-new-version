import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";
export type AccentColor = "orange" | "blue" | "green" | "purple";
export type DensityMode = "compact" | "comfortable" | "spacious";
export type RadiusMode = "none" | "sm" | "md" | "lg" | "full";

interface UIPreferencesState {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  motionEnabled: boolean;
  densityMode: DensityMode;
  radiusMode: RadiusMode;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setMotionEnabled: (enabled: boolean) => void;
  setDensityMode: (mode: DensityMode) => void;
  setRadiusMode: (mode: RadiusMode) => void;
}

export const useUIPreferences = create<UIPreferencesState>()(
  persist(
    (set) => ({
      themeMode: "system",
      accentColor: "orange",
      motionEnabled: true,
      densityMode: "comfortable",
      radiusMode: "md",
      setThemeMode: (mode) => set({ themeMode: mode }),
      setAccentColor: (color) => set({ accentColor: color }),
      setMotionEnabled: (enabled) => set({ motionEnabled: enabled }),
      setDensityMode: (mode) => set({ densityMode: mode }),
      setRadiusMode: (mode) => set({ radiusMode: mode }),
    }),
    {
      name: "ui-preferences",
    }
  )
);