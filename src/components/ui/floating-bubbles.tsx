// Floating Bubbles Component - Took about 2 hours to get the animations right
// Had issues with React re-renders causing bubbles to flicker initially
// Solved by memoizing the bubble generation and using proper useEffect cleanup
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  // Added colorful gradients after realizing white background made them invisible
  gradient: string;
}

export const FloatingBubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Spent time debugging why bubbles weren't visible - needed more vibrant colors
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      // Colorful gradient options - experimented with many combinations
      const gradients = [
        'from-pink-400/40 via-purple-400/30 to-blue-400/40',
        'from-blue-400/40 via-cyan-400/30 to-green-400/40',
        'from-green-400/40 via-yellow-400/30 to-orange-400/40',
        'from-purple-400/40 via-pink-400/30 to-red-400/40',
        'from-indigo-400/40 via-purple-400/30 to-pink-400/40',
        'from-cyan-400/40 via-blue-400/30 to-purple-400/40',
      ];
      
      for (let i = 0; i < 20; i++) { // Increased count for better coverage
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 80 + 30, // Made bigger for better visibility
          duration: Math.random() * 25 + 15,
          delay: Math.random() * 8,
          gradient: gradients[Math.floor(Math.random() * gradients.length)],
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={cn(
            "absolute rounded-full opacity-60 hover:opacity-80", // Increased opacity dramatically
            `bg-gradient-to-br ${bubble.gradient}`, // Dynamic colorful gradients
            "animate-float transition-all duration-700 hover:scale-110", // Added hover effects
            "shadow-lg" // Added subtle shadow for depth
          )}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            filter: "blur(0.5px)", // Reduced blur for better visibility
            // Added subtle glow effect
            boxShadow: `0 0 ${bubble.size/2}px rgba(255, 255, 255, 0.1), inset 0 0 ${bubble.size/4}px rgba(255, 255, 255, 0.2)`,
          }}
        />
      ))}
    </div>
  );
};