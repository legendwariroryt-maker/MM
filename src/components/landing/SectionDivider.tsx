import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface SectionDividerProps {
  className?: string;
  /** Decorative ornament center, e.g. "✦" or "·" */
  ornament?: string;
}

/**
 * Animated hairline divider that draws itself in when the section enters view.
 * Uses an SVG path with stroke-dashoffset animation, plus a small center ornament.
 */
export const SectionDivider = ({ className = "", ornament = "✦" }: SectionDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  // SVG path is 1000 wide; we animate stroke-dashoffset to "draw" the line.
  const pathLength = 1000;
  const initialOffset = reduce ? 0 : pathLength;
  const duration = reduce ? 0 : 1.4;

  return (
    <div ref={ref} className={`flex items-center justify-center gap-6 my-2 ${className}`}>
      <motion.svg
        viewBox="0 0 1000 4"
        preserveAspectRatio="none"
        className="flex-1 h-px max-w-[16rem]"
        aria-hidden
      >
        <motion.line
          x1="0"
          y1="2"
          x2="1000"
          y2="2"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>

      <motion.span
        aria-hidden
        className="text-[10px] tracking-[0.36em] uppercase text-muted-foreground/80 font-medium"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 4 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.6 }}
      >
        {ornament}
      </motion.span>

      <motion.svg
        viewBox="0 0 1000 4"
        preserveAspectRatio="none"
        className="flex-1 h-px max-w-[16rem]"
        aria-hidden
      >
        <motion.line
          x1="0"
          y1="2"
          x2="1000"
          y2="2"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>
    </div>
  );
};