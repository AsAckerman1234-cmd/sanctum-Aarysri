import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeName = "crimson" | "diamond";

interface ThemeCtx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "crimson", setTheme: () => {}, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("crimson");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("kalpa-theme")) as ThemeName | null;
    if (saved === "crimson" || saved === "diamond") setThemeState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.remove("theme-crimson", "theme-diamond");
    document.documentElement.classList.add(`theme-${theme}`);
    try {
      localStorage.setItem("kalpa-theme", theme);
    } catch {}
  }, [theme]);

  const setTheme = (t: ThemeName) => setThemeState(t);
  const toggle = () => setThemeState((p) => (p === "crimson" ? "diamond" : "crimson"));

  return <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);