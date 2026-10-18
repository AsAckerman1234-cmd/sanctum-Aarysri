import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

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
  const [veil, setVeil] = useState<{ to: RealmTheme; on: boolean } | null>(null);
  const themeRef = useRef(theme);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  themeRef.current = theme;

  const after = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

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

  const apply = useCallback((t: RealmTheme) => {
    setThemeState(t);
    setChanges((c) => c + 1);
    try {
      localStorage.setItem(KEY, t);
    } catch {}
  }, []);

  /**
   * Smooth switch: a light mist veil fades in (compositor-only opacity), the theme swaps
   * invisibly underneath it, then the veil dissolves to reveal the new atmosphere.
   * Nothing heavy animates on screen, so it never stutters.
   */
  const setTheme = useCallback(
    (t: RealmTheme) => {
      if (busy.current || t === themeRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        apply(t);
        return;
      }
      busy.current = true;
      setVeil({ to: t, on: false });
      requestAnimationFrame(() => requestAnimationFrame(() => setVeil({ to: t, on: true })));
      after(620, () => {
        apply(t);
        after(160, () => {
          setVeil({ to: t, on: false });
          after(1300, () => {
            setVeil(null);
            busy.current = false;
          });
        });
      });
    },
    [apply],
  );

  const toggle = useCallback(() => setTheme(REALM_THEMES[themeRef.current].next), [setTheme]);

  const { cls, label } = REALM_THEMES[theme];
  return (
    <RealmCtx.Provider value={{ theme, cls, label, changes, setTheme, toggle }}>
      {children}
      {veil && <div className={`r-veil to-${veil.to === "golden-mist" ? "mist" : "water"} ${veil.on ? "on" : ""}`} aria-hidden />}
    </RealmCtx.Provider>
  );
}

export const useRealmTheme = () => useContext(RealmCtx);
