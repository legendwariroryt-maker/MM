import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface AnimatedHeadlineProps {
  words: string[];
  /** Time each word stays visible (ms). */
  interval?: number;
  className?: string;
}

/**
 * Cycles through italic words with a soft crossfade.
 * Used in the hero headline ("understood → supported → held → seen").
 * Stops animating when prefers-reduced-motion is set.
 */
export const AnimatedHeadline = ({
  words,
  interval = 3500,
  className = "",
}: AnimatedHeadlineProps) => {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || words.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, reduce, words.length]);

  if (reduce) {
    // Show a single static word (the first) — no crossfade.
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {words[index]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
};