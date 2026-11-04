import { useEffect } from 'react';
import type { RefObject } from 'react';

/** One-shot scroll reveals; content stays visible when JS or motion is unavailable. */
export function useRevealMotion(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = root.current;
    if (!element || !('IntersectionObserver' in window)) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      let stagger = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches || document.hidden) continue;

        animations.push((entry.target as HTMLElement).animate(
          [
            { opacity: 0.35, transform: 'translate3d(0, 18px, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' },
          ],
          {
            duration: 520,
            delay: Math.min(stagger++ * 65, 130),
            easing: 'cubic-bezier(.16,1,.3,1)',
            fill: 'both',
          },
        ));
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });

    element.querySelectorAll<HTMLElement>('[data-reveal]').forEach((target) => observer.observe(target));
    const finishForReducedMotion = () => {
      if (preference.matches) animations.forEach((animation) => animation.finish());
    };
    preference.addEventListener('change', finishForReducedMotion);

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener('change', finishForReducedMotion);
    };
  }, [root]);
}
