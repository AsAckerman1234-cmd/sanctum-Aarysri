import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { MistCurtain, type CurtainPhase } from "./MistCurtain";
import { GlobalBackground } from "./GlobalBackground";
import { FloatingNavbar } from "./FloatingNavbar";
import { useRealmTheme } from "@/lib/realm-theme";

/** Page shell for the Art & Writing realm: theme classes, background, nav, cursor light, scroll reveal. */
export function RealmShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const { cls } = useRealmTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [phase, setPhase] = useState<CurtainPhase>("closed");

  // Mirror the theme class on <html> so portals (PDF reader) inherit the same tokens.
  useEffect(() => {
    const el = document.documentElement;
    el.classList.remove("realm-water", "realm-mist");
    el.classList.add("realm", cls);
  }, [cls]);
  useEffect(
    () => () => document.documentElement.classList.remove("realm", "realm-water", "realm-mist"),
    [],
  );

  // Part the mist once the page has painted.
  useEffect(() => {
    let a = 0;
    let b = 0;
    a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setPhase("open"));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    // Phones, tablets and "desktop site" mode on phones: skip scroll-parallax, shorten transitions.
    const lite = matchMedia("(max-width: 720px), (hover: none), (pointer: coarse)").matches;
    let raf = 0;
    let x = 0;
    let y = 0;
    let sy = 0;
    const flush = () => {
      raf = 0;
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
      root.style.setProperty("--r-sy", `${sy}`);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const card = (e.target as Element | null)?.closest?.(".glass") as HTMLElement | null;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--px", `${e.clientX - r.left}px`);
        card.style.setProperty("--py", `${e.clientY - r.top}px`);
      }
      schedule();
    };
    const onScroll = () => {
      sy = window.scrollY;
      schedule();
    };
    // Gather the mist, then navigate, so the next page opens out of it.
    let navTimer = 0;
    let fallback = 0;
    const onClick = (e: MouseEvent) => {
      if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a") as HTMLAnchorElement | null;
      const href = a?.getAttribute("href");
      if (!a || !href || !href.startsWith("/") || a.target === "_blank" || a.hasAttribute("download")) return;
      if (new URL(href, location.href).pathname === location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      setPhase("closing");
      navTimer = window.setTimeout(() => router.navigate({ to: href as never }), lite ? 260 : 650);
      fallback = window.setTimeout(() => setPhase("open"), 2600);
    };
    root.addEventListener("click", onClick);
    if (fine && !reduce) window.addEventListener("pointermove", onMove, { passive: true });
    if (!reduce && !lite) window.addEventListener("scroll", onScroll, { passive: true });

    // Scroll reveal: blur-to-focus as sections enter.
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    let io: IntersectionObserver | undefined;
    let startTimer = 0;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
    } else {
      root.classList.add("realm-js");
      io = new IntersectionObserver(
        (entries) =>
          entries
            .filter((en) => en.isIntersecting)
            .forEach((en, i) => {
              const el = en.target as HTMLElement;
              el.style.transitionDelay = `${i * 110}ms`;
              el.classList.add("in");
              io?.unobserve(el);
            }),
        { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
      );
      // wait for the mist to begin parting before revealing content
      startTimer = window.setTimeout(() => items.forEach((el) => io!.observe(el)), lite ? 150 : 550);
    }
    return () => {
      root.removeEventListener("click", onClick);
      clearTimeout(navTimer);
      clearTimeout(fallback);
      clearTimeout(startTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [router]);

  return (
    <div ref={rootRef} className={`realm ${cls} realm-root`}>
      <GlobalBackground />
      <FloatingNavbar />
      <MistCurtain phase={phase} />
      <main className={`r-main mx-auto ${wide ? "max-w-7xl" : "max-w-6xl"}`}>
        {children}
        <footer className="r-footer">© 2026 Aryan Srivastava · Woven in Golden Light</footer>
      </main>
    </div>
  );
}
