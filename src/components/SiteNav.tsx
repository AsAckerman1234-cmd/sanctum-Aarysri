import { Link } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme";

export function SiteNav() {
  const { theme, toggle } = useTheme();
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[min(1100px,94%)]">
      <nav className="glass px-5 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-lg font-serif tracking-widest gold-text">ॐ</span>
          <span className="text-sm sm:text-base font-serif tracking-[0.25em] uppercase">
            Aryan Srivastava
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.2em]">
          <Link to="/" className="link-underline opacity-80 hover:opacity-100">Home</Link>
          <Link to="/art-writing" className="link-underline opacity-80 hover:opacity-100">Art</Link>
          <Link to="/pov" className="link-underline opacity-80 hover:opacity-100">POV</Link>
          <Link to="/tech-work" className="link-underline opacity-80 hover:opacity-100">Tech</Link>
          <Link to="/kalpa-saga" className="link-underline opacity-80 hover:opacity-100">Saga</Link>
        </div>
        <button
          onClick={toggle}
          className="btn-mystic !py-2 !px-4 !text-[0.65rem]"
          aria-label="Switch theme"
          title={`Switch to ${theme === "crimson" ? "Diamond" : "Crimson"} Eclipse`}
        >
          <span aria-hidden>{theme === "crimson" ? "◐" : "◑"}</span>
          <span>{theme === "crimson" ? "Diamond" : "Crimson"}</span>
        </button>
      </nav>
    </header>
  );
}