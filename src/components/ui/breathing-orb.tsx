// Breathing Orb - Used CSS animations instead of JS for better performance
// Initially tried with Framer Motion but caused bundle size issues during hackathon time crunch
import { cn } from "@/lib/utils";

interface BreathingOrbProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BreathingOrb = ({ size = "md", className }: BreathingOrbProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div
      className={cn(
        "rounded-full animate-breathe transition-all duration-500 hover:scale-125",
        // Made much more vibrant and colorful - was too subtle before
        "bg-gradient-radial from-pink-400/50 via-purple-400/30 via-blue-400/20 to-transparent",
        "shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)]", // Purple glow
        "border border-white/20 hover:border-white/40", // Added glowing border effect
        sizeClasses[size],
        className
      )}
      // Added pulsing glow effect that changes colors
      style={{
        background: `
          radial-gradient(circle at 30% 30%, rgba(244,63,94,0.4) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(168,85,247,0.3) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(59,130,246,0.2) 0%, transparent 70%)
        `,
      }}
    />
  );
};