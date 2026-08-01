import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees on each axis. Default 6. */
  intensity?: number;
  /** Optional glare: a radial highlight that follows the cursor. Default true. */
  glare?: boolean;
}

/**
 * Wraps any element and gives it a subtle 3D tilt that tracks the cursor.
 * Adds an optional soft glare (radial gradient) for extra premium feel.
 * Falls back to a static wrapper when prefers-reduced-motion is set.
 */
export const TiltCard = ({
  children,
  className = "",
  intensity = 6,
  glare = true,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const sx = useSpring(mouseX, { stiffness: 200, damping: 22, mass: 0.4 });
  const sy = useSpring(mouseY, { stiffness: 200, damping: 22, mass: 0.4 });

  // Tilt: rotateY depends on horizontal cursor position; rotateX on vertical.
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);
  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);

  // Glare position follows cursor.
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]: (string | number)[]) =>
      `radial-gradient(600px circle at ${x} ${y}, hsl(var(--primary) / 0.14), transparent 60%)`
  );

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative will-change-transform", className)}
    >
      {children}

      {glare && !reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60 mix-blend-soft-light"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
};