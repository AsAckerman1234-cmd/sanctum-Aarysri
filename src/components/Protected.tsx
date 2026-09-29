import { useEffect, type ReactNode } from "react";

export function Protected({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "u", "c"].includes(k)) e.preventDefault();
      if (k === "printscreen") e.preventDefault();
      if (e.key === "F12") e.preventDefault();
    };
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return <div className="protected">{children}</div>;
}