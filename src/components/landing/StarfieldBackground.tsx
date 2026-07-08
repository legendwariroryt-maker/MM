import { useEffect, useRef } from "react";

/**
 * Nocturnal living background: canvas starfield + drifting nebula + parallax moons.
 * Fixed to viewport, sits behind everything (z: -20).
 */
export const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    type Star = { x: number; y: number; r: number; a: number; s: number; p: number };
    let stars: Star[] = [];

    type Shooting = { x: number; y: number; vx: number; vy: number; life: number; max: number };
    let shooting: Shooting | null = null;
    let nextShoot = 3000 + Math.random() * 5000;
    let last = performance.now();

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(1, (w * h) / (1920 * 1080));
      const count = Math.floor(260 * density) + 80;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.6 + 0.2,
        s: Math.random() * 0.02 + 0.005,
        p: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnShooting = () => {
      const fromLeft = Math.random() > 0.5;
      shooting = {
        x: fromLeft ? -50 : w + 50,
        y: Math.random() * h * 0.5,
        vx: fromLeft ? 8 + Math.random() * 4 : -(8 + Math.random() * 4),
        vy: 3 + Math.random() * 2,
        life: 0,
        max: 90,
      };
    };

    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(60, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);

      // Stars
      for (const s of stars) {
        if (!reduce) s.p += s.s * dt * 0.05;
        const twinkle = 0.5 + Math.sin(s.p) * 0.5;
        const alpha = s.a * (0.4 + twinkle * 0.6);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(220, 60%, 96%, ${alpha})`;
        ctx.fill();
        if (s.r > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(260, 90%, 85%, ${alpha * 0.08})`;
          ctx.fill();
        }
      }

      // Shooting star
      if (!reduce) {
        nextShoot -= dt;
        if (!shooting && nextShoot <= 0) {
          spawnShooting();
          nextShoot = 6000 + Math.random() * 6000;
        }
        if (shooting) {
          shooting.life += 1;
          shooting.x += shooting.vx;
          shooting.y += shooting.vy;
          const grad = ctx.createLinearGradient(
            shooting.x,
            shooting.y,
            shooting.x - shooting.vx * 10,
            shooting.y - shooting.vy * 10
          );
          grad.addColorStop(0, "hsla(50, 100%, 90%, 0.95)");
          grad.addColorStop(1, "hsla(50, 100%, 90%, 0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(shooting.x, shooting.y);
          ctx.lineTo(shooting.x - shooting.vx * 10, shooting.y - shooting.vy * 10);
          ctx.stroke();
          if (shooting.life > shooting.max) shooting = null;
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Mouse parallax for orbs
    const onMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 40;
      const my = (e.clientY / window.innerHeight - 0.5) * 40;
      if (orb1Ref.current) orb1Ref.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (orb2Ref.current) orb2Ref.current.style.transform = `translate3d(${-mx}px, ${-my}px, 0)`;
    };
    if (!reduce) window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Deep night gradient — respects theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.18),transparent_60%),radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.16),transparent_55%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))]" />

      {/* Drifting nebula (conic gradient, ultra-slow rotation) */}
      <div
        className="absolute -inset-1/4 opacity-40 mix-blend-screen dark:mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, hsl(var(--primary)/0.25), transparent 25%, hsl(var(--accent)/0.22) 50%, transparent 75%, hsl(var(--primary)/0.25))",
          filter: "blur(80px)",
          animation: "nebula-spin 140s linear infinite",
        }}
      />

      {/* Starfield canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Foreground parallax moons */}
      <div
        ref={orb1Ref}
        className="absolute top-[12%] left-[8%] w-40 h-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, hsl(50 100% 92% / 0.9), hsl(45 80% 70% / 0.35) 55%, transparent 70%)",
          filter: "blur(2px)",
          boxShadow: "0 0 80px hsl(50 100% 80% / 0.35)",
          transition: "transform 400ms cubic-bezier(.2,.7,.2,1)",
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-[18%] right-[10%] w-56 h-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, hsl(var(--primary) / 0.55), hsl(var(--accent) / 0.25) 55%, transparent 72%)",
          filter: "blur(4px)",
          transition: "transform 500ms cubic-bezier(.2,.7,.2,1)",
        }}
      />

      {/* Vignette so lower sections stay readable */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_55%,hsl(var(--background)/0.75)_100%)]" />

      <style>{`
        @keyframes nebula-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default StarfieldBackground;