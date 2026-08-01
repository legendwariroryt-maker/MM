import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** Maximum px translation on each axis. Default 8. */
  strength?: number;
}

/**
 * Wraps a child button/element and pulls it toward the cursor as the user
 * hovers nearby. The interaction zone is larger than the button itself so
 * the pull begins before the cursor reaches the button edge.
 *
 * Honors prefers-reduced-motion — falls back to a no-op wrapper when set.
 */
export const MagneticButton = ({
  children,
  className = "",
  strength = 8,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    // px / py are in the box-centered space; map directly.
    x.set((px / rect.width) * strength * 2);
    y.set((py / rect.height) * strength * 2);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
};