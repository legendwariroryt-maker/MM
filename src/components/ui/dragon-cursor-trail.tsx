import { useEffect, useRef, useState } from 'react';

interface DragonSegment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'head' | 'body' | 'tail';
  scale: number;
}

export function DragonCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const segments = useRef<DragonSegment[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize dragon segments
    const segmentCount = 12;
    for (let i = 0; i < segmentCount; i++) {
      segments.current.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: 0,
        vy: 0,
        type: i === 0 ? 'head' : i > segmentCount - 4 ? 'tail' : 'body',
        scale: i === 0 ? 1 : 1 - (i / segmentCount) * 0.5
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const drawDragonHead = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);

      // Dragon head outline
      ctx.beginPath();
      ctx.moveTo(25, 0);
      ctx.bezierCurveTo(25, -8, 20, -12, 12, -12);
      ctx.bezierCurveTo(8, -12, 0, -10, -5, -8);
      ctx.lineTo(-8, -5);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-8, 5);
      ctx.lineTo(-5, 8);
      ctx.bezierCurveTo(0, 10, 8, 12, 12, 12);
      ctx.bezierCurveTo(20, 12, 25, 8, 25, 0);
      ctx.closePath();

      // Gradient fill
      const gradient = ctx.createLinearGradient(-10, 0, 25, 0);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(0.5, '#059669');
      gradient.addColorStop(1, '#047857');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#10b981';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Eye
      ctx.beginPath();
      ctx.arc(15, -3, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(16, -3, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();

      // Nostril
      ctx.beginPath();
      ctx.arc(22, 2, 1, 0, Math.PI * 2);
      ctx.fillStyle = '#047857';
      ctx.fill();

      // Horns
      ctx.beginPath();
      ctx.moveTo(8, -12);
      ctx.lineTo(6, -20);
      ctx.lineTo(10, -13);
      ctx.closePath();
      ctx.fillStyle = '#059669';
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(8, 12);
      ctx.lineTo(6, 20);
      ctx.lineTo(10, 13);
      ctx.closePath();
      ctx.fillStyle = '#059669';
      ctx.fill();
      ctx.stroke();

      // Teeth/spikes on jaw
      for (let i = 0; i < 3; i++) {
        const tx = 15 + i * 4;
        ctx.beginPath();
        ctx.moveTo(tx, -6);
        ctx.lineTo(tx + 2, -3);
        ctx.lineTo(tx, 0);
        ctx.closePath();
        ctx.fillStyle = '#d1fae5';
        ctx.fill();
      }

      ctx.restore();
    };

    const drawDragonBody = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, segment: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const size = 18 * scale;
      const wobble = Math.sin(time.current * 3 + segment) * 2;

      // Body segment with scales
      ctx.beginPath();
      ctx.ellipse(0, wobble, size, size * 0.7, 0, 0, Math.PI * 2);
      
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, '#06b6d4');
      gradient.addColorStop(0.6, '#0891b2');
      gradient.addColorStop(1, '#0e7490');
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.shadowBlur = 10;
      ctx.shadowColor = '#06b6d4';
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scales pattern
      ctx.beginPath();
      ctx.arc(-size * 0.3, wobble - 3, 3, 0, Math.PI * 2);
      ctx.arc(size * 0.3, wobble + 3, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.3)';
      ctx.fill();

      // Wings on certain segments
      if (segment === 3 || segment === 4) {
        const wingAngle = Math.sin(time.current * 8) * 0.4;
        
        // Top wing
        ctx.save();
        ctx.rotate(wingAngle - Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(10, -15, 25, -20, 35, -15);
        ctx.bezierCurveTo(30, -10, 15, -5, 0, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.fill();
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // Bottom wing
        ctx.save();
        ctx.rotate(-wingAngle + Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(10, 15, 25, 20, 35, 15);
        ctx.bezierCurveTo(30, 10, 15, 5, 0, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.fill();
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    };

    const drawDragonTail = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, segment: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const size = 12 * scale;
      const wobble = Math.sin(time.current * 4 + segment) * 3;

      // Tail segment
      ctx.beginPath();
      ctx.ellipse(0, wobble, size, size * 0.6, 0, 0, Math.PI * 2);
      
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(0.6, '#2563eb');
      gradient.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.shadowBlur = 8;
      ctx.shadowColor = '#3b82f6';
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Tail fin
      if (segment > 9) {
        ctx.beginPath();
        ctx.moveTo(0, wobble - size);
        ctx.lineTo(-8, wobble - size - 10);
        ctx.lineTo(8, wobble - size - 10);
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
        ctx.fill();
        ctx.strokeStyle = '#60a5fa';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, wobble + size);
        ctx.lineTo(-8, wobble + size + 10);
        ctx.lineTo(8, wobble + size + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    };

    const animate = () => {
      time.current += 0.016;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update head to follow mouse with smooth interpolation
      const head = segments.current[0];
      const dx = mousePos.current.x - head.x;
      const dy = mousePos.current.y - head.y;
      
      head.vx += dx * 0.001;
      head.vy += dy * 0.001;
      head.vx *= 0.92;
      head.vy *= 0.92;
      
      head.x += head.vx;
      head.y += head.vy;

      // Update body segments to follow with spring physics
      for (let i = 1; i < segments.current.length; i++) {
        const segment = segments.current[i];
        const prev = segments.current[i - 1];
        
        const dx = prev.x - segment.x;
        const dy = prev.y - segment.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const targetDistance = 20;
        
        if (distance > 0) {
          const force = (distance - targetDistance) * 0.15;
          segment.vx += (dx / distance) * force;
          segment.vy += (dy / distance) * force;
        }
        
        segment.vx *= 0.88;
        segment.vy *= 0.88;
        
        segment.x += segment.vx;
        segment.y += segment.vy;
      }

      // Draw connecting body
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(segments.current[0].x, segments.current[0].y);
      for (let i = 1; i < segments.current.length; i++) {
        const seg = segments.current[i];
        ctx.lineTo(seg.x, seg.y);
      }
      ctx.stroke();

      // Draw dragon segments
      for (let i = segments.current.length - 1; i >= 0; i--) {
        const segment = segments.current[i];
        const nextSegment = segments.current[i + 1] || segment;
        
        const dx = segment.x - nextSegment.x;
        const dy = segment.y - nextSegment.y;
        const angle = Math.atan2(dy, dx);

        if (segment.type === 'head') {
          drawDragonHead(ctx, segment.x, segment.y, angle, segment.scale);
        } else if (segment.type === 'tail') {
          drawDragonTail(ctx, segment.x, segment.y, angle, segment.scale, i);
        } else {
          drawDragonBody(ctx, segment.x, segment.y, angle, segment.scale, i);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
}
