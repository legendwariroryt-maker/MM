import type { SVGProps } from "react";

/** Hand-drawn wobbly underline that sits under a heading */
export const SquiggleUnderline = ({ className = "", ...rest }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 200 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className={className}
    aria-hidden
    {...rest}
  >
    <path d="M2 7 C 20 2, 40 11, 60 6 S 100 2, 120 7 S 160 11, 198 5" />
  </svg>
);

/** Rough irregular border ring around a badge/button */
export const RoughRing = ({ className = "", ...rest }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 200 60"
    preserveAspectRatio="none"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...rest}
  >
    <path d="M18 4 C 60 2, 120 6, 184 3 C 196 7, 197 24, 195 40 C 197 52, 170 57, 130 55 C 90 58, 40 56, 10 55 C 3 46, 4 30, 4 20 C 3 12, 8 6, 18 4 Z" />
  </svg>
);

/** Sketched circle used behind icons */
export const SketchCircle = ({ className = "", ...rest }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" className={className} aria-hidden {...rest}>
    <path d="M30 4 C 45 5, 56 15, 56 30 C 57 46, 44 57, 29 56 C 14 57, 4 45, 4 30 C 3 15, 15 3, 30 4 Z" />
  </svg>
);

/** Little 4-point doodle star */
export const DoodleStar = ({ className = "", ...rest }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden {...rest}>
    <path d="M12 2 L13.5 9.2 L21 10.5 L15 14.3 L16.7 21.6 L12 17.4 L7.3 21.6 L9 14.3 L3 10.5 L10.5 9.2 Z" />
  </svg>
);

/** Two small dashes to flank an eyebrow label */
export const DashFlank = ({ className = "", ...rest }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 40 8" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className={className} aria-hidden {...rest}>
    <path d="M2 4 C 8 2, 16 6, 24 3 S 36 6, 38 4" />
  </svg>
);

/** Corner flourish (top-right of a card) */
export const CornerFlourish = ({ className = "", ...rest }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" className={className} aria-hidden {...rest}>
    <path d="M4 36 C 12 34, 20 28, 26 22 S 34 10, 36 4" />
    <path d="M22 4 L 36 4 L 36 18" />
  </svg>
);

/** Wobbly hand-drawn 5-point star for ratings */
export const WobblyStar = ({ className = "", ...rest }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0.6} strokeLinejoin="round" className={className} aria-hidden {...rest}>
    <path d="M12 2.4 C 12.6 5, 13.6 7.5, 14.4 9.2 C 16.3 9.4, 19.1 9.8, 21.3 10.5 C 19.8 12.1, 17.6 13.9, 16 15.1 C 16.4 17.1, 17 19.8, 17.2 21.6 C 15.4 20.7, 13.3 19.4, 12 18.6 C 10.8 19.3, 8.6 20.6, 6.9 21.6 C 7 19.7, 7.7 17.2, 8.1 15.1 C 6.5 13.8, 4.3 12, 2.8 10.5 C 4.9 9.9, 7.6 9.5, 9.6 9.2 C 10.5 7.4, 11.4 5, 12 2.4 Z" />
  </svg>
);