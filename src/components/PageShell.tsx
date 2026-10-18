import type { ReactNode } from "react";
import { EclipseBackground } from "./EclipseBackground";
import { SiteNav } from "./SiteNav";

export function PageShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <>
      <EclipseBackground />
      <SiteNav />
      <main className={`relative z-10 pt-28 pb-24 px-4 sm:px-6 mx-auto ${wide ? "max-w-7xl" : "max-w-6xl"}`}>
        {children}
        <footer className="mt-24 text-center text-xs opacity-60 tracking-[0.2em] uppercase">
          © 2026 Aryan Srivastava · Woven under the Eclipse
        </footer>
      </main>
    </>
  );
}