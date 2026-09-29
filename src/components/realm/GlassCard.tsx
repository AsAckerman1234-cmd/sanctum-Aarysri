import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <article className={`glass glass-hover r-card ${className}`} data-reveal>
      {children}
    </article>
  );
}

export function DivineButton({
  to,
  children,
  className = "",
  onClick,
}: {
  to?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  if (to)
    return (
      <Link to={to as never} className={`btn-mystic r-btn ${className}`}>
        {children}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={`btn-mystic r-btn ${className}`}>
      {children}
    </button>
  );
}
