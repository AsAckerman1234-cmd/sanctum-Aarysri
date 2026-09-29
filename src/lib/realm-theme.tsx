import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/** The two atmospheric states of the realm. */
export type RealmTheme = "golden-water" | "golden-mist";

export const REALM_THEMES: Record<RealmTheme, { label: string; cls: string; next: RealmTheme }> = {
  "golden-water": { label: "Golden Water", cls: "realm-water", next: "golden-mist" },
  "golden-mist": { label: "Golden Mist", cls: "realm-mist", next: "golden-water" },
};

const KEY = "realm-theme";

interface Ctx {
  theme: RealmTheme;
  cls: string;
  label: string;
  /** Number of user-initiated switches this session (drives the transition pulse). */
  changes: number;
  setTheme: (t: RealmTheme) => void;
  toggle: () => void;
}

const RealmCtx = createContext<Ctx>({
  theme: "golden-water",
  cls: "realm-water",
  label: "Golden Water",
  changes: 0,
  setTheme: () => {},
  toggle: () => {},
});

const isTheme = (v: unknown): v is RealmTheme => v === "golden-water" || v === "golden-mist";

export function RealmThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<RealmTheme>("golden-water");
  const [changes, setChanges] = useState(0);

  // Restore the saved atmosphere after hydration, and stay in sync across tabs.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (isTheme(saved)) setThemeState(saved);
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && isTheme(e.newValue)) setThemeState(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((t: RealmTheme) => {
    setThemeState((prev) => {
      if (prev !== t) setChanges((c) => c + 1);
      return t;
    });
    try {
      localStorage.setItem(KEY, t);
    } catch {}
  }, []);

  const toggle = useCallback(() => setTheme(REALM_THEMES[theme].next), [theme, setTheme]);

  const { cls, label } = REALM_THEMES[theme];
  return (
    <RealmCtx.Provider value={{ theme, cls, label, changes, setTheme, toggle }}>{children}</RealmCtx.Provider>
  );
}

export const useRealmTheme = () => useContext(RealmCtx);
