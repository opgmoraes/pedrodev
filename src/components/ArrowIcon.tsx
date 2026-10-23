import type { CSSProperties } from "react";

type Direction = "up-right" | "right" | "left" | "up" | "down";
const paths: Record<Direction, string> = {
  "up-right": "M6 18 18 6M6 6h12v12",
  right: "M4 12h16m-7-7 7 7-7 7",
  left: "M20 12H4m7-7-7 7 7 7",
  up: "M12 20V4m-7 7 7-7 7 7",
  down: "M12 4v16m-7-7 7 7 7-7",
};
const style: CSSProperties = { display: "inline-block", verticalAlign: "-0.16em", flexShrink: 0 };
export default function ArrowIcon({ direction = "up-right", className = "" }: { direction?: Direction; className?: string }) {
  return <svg className={`arrow-icon ${className}`} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={style}><path d={paths[direction]} /></svg>;
}
