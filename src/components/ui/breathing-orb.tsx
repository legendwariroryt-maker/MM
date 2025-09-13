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
        "rounded-full animate-breathe",
        "bg-gradient-radial from-primary/20 via-primary/10 to-transparent",
        "shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]",
        sizeClasses[size],
        className
      )}
    />
  );
};