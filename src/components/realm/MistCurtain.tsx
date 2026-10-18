import { SacredGeometry } from "./SacredGeometry";

export type CurtainPhase = "closed" | "open" | "closing";

/**
 * A veil of golden mist. It covers the page on arrival, then parts and dissolves
 * to reveal it; on departure it gathers again before the next page opens.
 */
export function MistCurtain({ phase }: { phase: CurtainPhase }) {
  return (
    <div className={`r-curtain ${phase}`} aria-hidden>
      <div className="cv cv-base" />
      <div className="cv cv-l" />
      <div className="cv cv-r" />
      <div className="cv cv-b" />
      <div className="cv cv-core" />
      <div className="cv cv-seal">
        <SacredGeometry variant="mini" className="spin" />
      </div>
    </div>
  );
}
