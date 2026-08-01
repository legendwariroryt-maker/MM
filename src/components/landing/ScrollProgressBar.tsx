import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Slim progress bar pinned to the top of the viewport.
 * Tracks scroll progress and transitions with theme tokens.
 */
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left
                 bg-gradient-to-r from-primary via-accent to-primary"
      style={{ scaleX }}
    />
  );
};