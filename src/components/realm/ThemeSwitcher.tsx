import { REALM_THEMES, useRealmTheme } from "@/lib/realm-theme";

/** One global control: a small celestial orb that shifts the whole realm between two atmospheres. */
export function ThemeSwitcher() {
  const { theme, label, toggle } = useRealmTheme();
  const nextLabel = REALM_THEMES[REALM_THEMES[theme].next].label;
  return (
    <button
      type="button"
      onClick={toggle}
      className="r-switch"
      data-tip={`Enter ${nextLabel}`}
      aria-label={`Atmosphere: ${label}. Switch to ${nextLabel}`}
    >
      <span className="r-orb" aria-hidden>
        <span className="o-w" />
        <span className="o-m" />
        <span className="o-ring" />
      </span>
      <span className="r-switch-label">{label}</span>
    </button>
  );
}
