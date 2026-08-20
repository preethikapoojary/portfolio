import { useEffect, useRef } from 'react';

/**
 * A single <canvas> covering the viewport, painted with a fixed set of
 * stars that twinkle, drift extremely slowly, and react to the cursor:
 * nearby stars grow, brighten, twinkle faster, and pick up a soft glow,
 * all eased smoothly in and back out. There is still no separate shape
 * drawn for the "spotlight" itself — every visible change is the stars'
 * own size/brightness/glow, nothing more.
 *
 * Canvas-based (not DOM nodes) so this stays cheap: one paint pass per
 * frame, and the more expensive glow (shadowBlur) is only applied to the
 * handful of stars actually reacting at any moment, not all of them.
 */
export default function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Tint the glow with the site's own primary theme color (blended with
    // white for a soft pastel glow, rather than a raw saturated color).
    const glowRgb = (() => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
      const hex = raw.replace('#', '');
      if (!/^[0-9a-f]{6}$/i.test(hex)) return { r: 150, g: 170, b: 255 };
      const num = parseInt(hex, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return { r: Math.round(r * 0.5 + 255 * 0.5), g: Math.round(g * 0.5 + 255 * 0.5), b: Math.round(b * 0.5 + 255 * 0.5) };
    })();

    let stars = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR — no need for 3x on a background layer

    const mouse = { x: -9999, y: -9999 };
    const PROXIMITY_RADIUS = 220; // px — wide enough that a noticeable cluster of stars reacts at once
    const RISE_EASE = 0.16; // brightening is a touch quicker than fading — reads as "responsive"
    const FALL_EASE = 0.045; // fading back is slower and gentler — no sudden flashing

    function makeStars() {
      const area = width * height;
      const count = Math.max(80, Math.min(220, Math.round(area / 9000)));
      stars = Array.from({ length: count }, () => {
        const isBright = Math.random() < 0.1; // ~10% naturally brighter/larger, for night-sky depth
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: isBright ? Math.random() * 1.0 + 1.6 : Math.random() * 1.2 + 0.4,
          baseAlpha: isBright ? Math.random() * 0.25 + 0.7 : Math.random() * 0.5 + 0.35,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          phase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.012, // very slow — barely perceptible parallax drift
          driftY: (Math.random() - 0.5) * 0.012,
          boost: 0, // current interactive reaction strength (0–1), eased toward target each frame
        };
      });
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeStars();
    }

    let rafId = null;
    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        if (!prefersReducedMotion) {
          star.x += star.driftX;
          star.y += star.driftY;
          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;
        }

        // Ripple falloff: smoothstep rather than linear, so stars closest
        // to the cursor react much more strongly and it tapers off softly
        // toward the edge of the radius, instead of a flat linear ramp.
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const rawT = dist < PROXIMITY_RADIUS ? 1 - dist / PROXIMITY_RADIUS : 0;
        const targetBoost = rawT * rawT * (3 - 2 * rawT); // smoothstep

        const ease = targetBoost > star.boost ? RISE_EASE : FALL_EASE;
        star.boost += (targetBoost - star.boost) * ease;

        const twinkleSpeed = star.twinkleSpeed * (1 + star.boost * 2.2); // twinkle noticeably faster when reacting
        const twinkleAmplitude = prefersReducedMotion ? 0 : 0.35 + star.boost * 0.3;
        const twinkle = prefersReducedMotion ? 0 : Math.sin(t * twinkleSpeed + star.phase) * twinkleAmplitude;

        const alpha = Math.max(0.1, Math.min(1, star.baseAlpha + twinkle + star.boost * 0.7));
        const radius = star.r * (1 + star.boost * 2); // up to ~3x size at full reaction

        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;

        // Soft glow halo — only paid for on stars actually reacting, so
        // the vast majority of the field costs nothing extra per frame.
        if (star.boost > 0.03) {
          ctx.shadowBlur = 14 * star.boost;
          ctx.shadowColor = `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${0.85 * star.boost})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }
      ctx.shadowBlur = 0; // reset so it never bleeds into the next frame's first star
      t += 1;
      rafId = requestAnimationFrame(draw);
    }

    function handleMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function handleMouseLeave() {
      // Cursor left the viewport entirely — let every star ease back to normal.
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function handleVisibility() {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!rafId) {
        rafId = requestAnimationFrame(draw);
      }
    }

    resize();
    draw(); // always paint at least one frame immediately

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1]"
    />
  );
}
