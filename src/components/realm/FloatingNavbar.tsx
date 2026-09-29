import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { SacredGeometry } from "./SacredGeometry";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/art-writing", label: "Art & Writing" },
  { to: "/kalpa-saga", label: "Novel" },
  { to: "/books", label: "Books" },
  { to: "/pov", label: "POV" },
  { to: "/tech-work", label: "Tech" },
] as const;

export function FloatingNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="r-nav">
      <nav className="r-nav-bar" aria-label="Primary">
        <Link to="/" className="r-brand" onClick={() => setOpen(false)}>
          <SacredGeometry variant="mini" className="r-brand-seal" />
          <span>Aryan Srivastava</span>
        </Link>
        <div className="r-links">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="r-link" activeProps={{ className: "r-link is-active" }} activeOptions={{ exact: true }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="r-nav-end">
          <ThemeSwitcher />
          <button
            type="button"
            className="r-burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <i />
            <i />
          </button>
        </div>
      </nav>
      {open && (
        <div className="r-menu glass">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="r-link" activeProps={{ className: "r-link is-active" }} activeOptions={{ exact: true }} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
