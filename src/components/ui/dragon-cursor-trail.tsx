import { useEffect, useRef, useState } from 'react';

interface DragonSegment {
  x: number;
  y: number;
  type: 'head' | 'body' | 'fin';
  index: number;
}

export function DragonCursorTrail() {
  const [segments, setSegments] = useState<DragonSegment[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const segmentCount = 15;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const updateDragon = () => {
      setSegments(prev => {
        const newSegments: DragonSegment[] = [];
        const { x, y } = mousePos.current;

        // If no segments yet, initialize them
        if (prev.length === 0) {
          for (let i = 0; i < segmentCount; i++) {
            newSegments.push({
              x,
              y,
              type: i === 0 ? 'head' : i === 8 || i === 14 ? 'fin' : 'body',
              index: i
            });
          }
          return newSegments;
        }

        // Update segments to follow cursor
        for (let i = 0; i < segmentCount; i++) {
          if (i === 0) {
            // Head follows cursor directly with smooth interpolation
            const prevHead = prev[0];
            const dx = x - prevHead.x;
            const dy = y - prevHead.y;
            newSegments.push({
              x: prevHead.x + dx * 0.3,
              y: prevHead.y + dy * 0.3,
              type: 'head',
              index: i
            });
          } else {
            // Each segment follows the previous one
            const prevSeg = prev[i];
            const targetSeg = newSegments[i - 1];
            const dx = targetSeg.x - prevSeg.x;
            const dy = targetSeg.y - prevSeg.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const targetDistance = 20;

            let newX = prevSeg.x;
            let newY = prevSeg.y;

            if (distance > 1) {
              const ratio = targetDistance / distance;
              newX = targetSeg.x - dx * ratio;
              newY = targetSeg.y - dy * ratio;
            }

            // Smooth movement
            newX = prevSeg.x + (newX - prevSeg.x) * 0.4;
            newY = prevSeg.y + (newY - prevSeg.y) * 0.4;

            newSegments.push({
              x: newX,
              y: newY,
              type: i === 8 || i === 14 ? 'fin' : 'body',
              index: i
            });
          }
        }

        return newSegments;
      });

      animationFrameRef.current = requestAnimationFrame(updateDragon);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(updateDragon);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Calculate distance between segments to determine if stretched
  const getStretchClass = (index: number) => {
    if (index === 0 || segments.length < index + 1) return false;
    const current = segments[index];
    const prev = segments[index - 1];
    const dx = current.x - prev.x;
    const dy = current.y - prev.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance > 25;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <svg className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="dragonGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.6 }} />
          </radialGradient>
        </defs>

        {/* Draw connecting lines for dragon body */}
        {segments.map((segment, i) => {
          if (i === 0) return null;
          const prev = segments[i - 1];
          return (
            <line
              key={`line-${i}`}
              x1={prev.x}
              y1={prev.y}
              x2={segment.x}
              y2={segment.y}
              stroke="url(#dragonGradient)"
              strokeWidth={getStretchClass(i) ? "4" : "6"}
              strokeLinecap="round"
              filter="url(#glow)"
              opacity={0.8}
            />
          );
        })}

        {/* Draw dragon segments */}
        {segments.map((segment) => {
          if (segment.type === 'head') {
            return (
              <g key={`seg-${segment.index}`}>
                <circle
                  cx={segment.x}
                  cy={segment.y}
                  r="12"
                  fill="#10b981"
                  filter="url(#glow)"
                />
                <circle
                  cx={segment.x - 3}
                  cy={segment.y - 3}
                  r="2"
                  fill="#fef08a"
                />
                <circle
                  cx={segment.x + 3}
                  cy={segment.y - 3}
                  r="2"
                  fill="#fef08a"
                />
              </g>
            );
          } else if (segment.type === 'fin') {
            const angle = Math.atan2(
              segment.y - (segments[segment.index - 1]?.y || segment.y),
              segment.x - (segments[segment.index - 1]?.x || segment.x)
            );
            return (
              <g key={`seg-${segment.index}`} transform={`translate(${segment.x}, ${segment.y})`}>
                <ellipse
                  rx="18"
                  ry="8"
                  fill="#10b981"
                  opacity="0.7"
                  filter="url(#glow)"
                  transform={`rotate(${(angle * 180) / Math.PI + 90})`}
                />
                <circle
                  r="6"
                  fill="url(#dragonGradient)"
                  filter="url(#glow)"
                />
              </g>
            );
          } else {
            return (
              <circle
                key={`seg-${segment.index}`}
                cx={segment.x}
                cy={segment.y}
                r={8 - segment.index * 0.2}
                fill="url(#dragonGradient)"
                filter="url(#glow)"
                opacity={0.9}
              />
            );
          }
        })}
      </svg>
    </div>
  );
}