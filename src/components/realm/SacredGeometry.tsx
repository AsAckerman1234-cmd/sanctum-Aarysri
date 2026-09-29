/** Yantra / lotus-mandala line drawing. Colour comes from `currentColor`. */
export function SacredGeometry({
  variant = "field",
  className = "",
}: {
  variant?: "field" | "mini";
  className?: string;
}) {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const inner = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg viewBox="-300 -300 600 600" className={`r-geo-svg ${className}`} fill="none" stroke="currentColor" aria-hidden>
      <circle r="292" />
      {variant === "field" && (
        <>
          <circle r="276" strokeDasharray="2 7" />
          {ticks.map((a) => (
            <line key={a} y1="-292" y2={a % 15 === 0 ? -276 : -284} transform={`rotate(${a})`} />
          ))}
          <circle r="232" />
          {petals.map((a) => (
            <ellipse key={a} cy="-170" rx="30" ry="62" transform={`rotate(${a})`} />
          ))}
          <circle r="150" />
          <polygon points="0,-120 104,60 -104,60" />
          <polygon points="0,120 104,-60 -104,-60" />
        </>
      )}
      {inner.map((a) => (
        <ellipse key={a} cy={variant === "field" ? -104 : -170} rx={variant === "field" ? 22 : 46} ry={variant === "field" ? 44 : 96} transform={`rotate(${a})`} />
      ))}
      <rect x="-92" y="-92" width="184" height="184" />
      <rect x="-92" y="-92" width="184" height="184" transform="rotate(45)" />
      <circle r="44" />
      <circle r="7" fill="currentColor" stroke="none" />
    </svg>
  );
}
