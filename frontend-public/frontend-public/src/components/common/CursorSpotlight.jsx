import { useEffect, useRef } from 'react';

/**
 * A soft radial glow that follows the pointer, blended additively (mix-blend
 * screen) at low opacity so it brightens the area under the cursor without
 * ever obscuring text. Position is updated via a ref + rAF rather than React
 * state, so mouse movement never triggers a re-render — this is what keeps
 * it lag-free. Disabled entirely on touch devices, where there's no real
 * cursor to follow.
 */
export default function CursorSpotlight() {
  const glowRef = useRef(null);
  const target = useRef({ x: -9999, y: -9999 });
  const current = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || prefersReducedMotion || !glowRef.current) return undefined;

    const handleMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    let rafId;
    function animate() {
      // Gentle easing toward the real cursor position — this is what makes
      // the glow feel smooth/elegant rather than snapping instantly.
      current.current.x += (target.current.x - current.current.x) * 0.15;
      current.current.y += (target.current.y - current.current.y) * 0.15;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', handleMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] hidden h-[420px] w-[420px] rounded-full opacity-[0.15] blur-3xl [mix-blend-mode:screen] md:block"
      style={{
        background: 'radial-gradient(circle, var(--color-primary), var(--color-secondary) 45%, transparent 70%)',
      }}
    />
  );
}
