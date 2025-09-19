import { useEffect, useRef, useState } from 'react';

interface DragonTrail {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
}

export function DragonCursorTrail() {
  const [trails, setTrails] = useState<DragonTrail[]>([]);
  const trailIdRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastTrailTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      // Only create new trail if mouse moved enough distance and enough time passed
      const distance = Math.sqrt(
        Math.pow(e.clientX - lastMouseX, 2) + Math.pow(e.clientY - lastMouseY, 2)
      );
      
      if (distance > 15 && now - lastTrailTime > 50) {
        const newTrail: DragonTrail = {
          id: trailIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          opacity: 1,
          scale: 1,
          rotation: Math.random() * 360,
        };

        setTrails(prev => [...prev.slice(-8), newTrail]); // Keep max 9 trails
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastTrailTime = now;
      }
    };

    const animateTrails = () => {
      setTrails(prev => 
        prev
          .map(trail => ({
            ...trail,
            opacity: trail.opacity - 0.08,
            scale: trail.scale + 0.02,
            rotation: trail.rotation + 2,
          }))
          .filter(trail => trail.opacity > 0)
      );
      animationFrameRef.current = requestAnimationFrame(animateTrails);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animateTrails);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50" style={{ mixBlendMode: 'multiply' }}>
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl select-none"
          style={{
            left: trail.x,
            top: trail.y,
            opacity: trail.opacity,
            transform: `translate(-50%, -50%) scale(${trail.scale}) rotate(${trail.rotation}deg)`,
            transition: 'none',
            filter: 'drop-shadow(0 0 8px rgba(255, 192, 203, 0.6))',
          }}
        >
          🐉
        </div>
      ))}
    </div>
  );
}