import { useEffect } from "react";
import type { RefObject } from "react";

// Variáveis visuais transitórias não provocam renderizações do React.
// No máximo um frame por evento; nenhuma animação contínua em JavaScript.
export function useStudioMotion(root: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    const scenes = [
      ...element.querySelectorAll<HTMLElement>("[data-motion-scene]"),
    ];
    const reveals: Animation[] = [];
    const revealObserver = new IntersectionObserver((entries) => {
      let stagger = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealObserver.unobserve(entry.target);
        if (preference.matches) continue;
        reveals.push((entry.target as HTMLElement).animate(
          [{ opacity: .3, transform: "translateY(22px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 420, delay: Math.min(stagger++ * 70, 140), easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" },
        ));
      }
    }, { threshold: .12 });
    element.querySelectorAll(".project-card").forEach(card => revealObserver.observe(card));
    const hero = element.querySelector<HTMLElement>(".studio-hero");
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          (entry.target as HTMLElement).dataset.inView = String(
            entry.isIntersecting,
          );
      },
      { rootMargin: "100px" },
    );
    scenes.forEach((scene) => visibilityObserver.observe(scene));

    const update = () => {
      frame = 0;
      if (disposed || preference.matches) return;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) continue;
        const progress = Math.max(
          -1,
          Math.min(1, (vh / 2 - rect.top - rect.height / 2) / vh),
        );
        scene.style.setProperty("--scene-y", `${(progress * 65).toFixed(2)}px`);
        scene.style.setProperty(
          "--scene-y-back",
          `${(progress * -40).toFixed(2)}px`,
        );
      }
    };
    const schedule = () => {
      if (!frame && !preference.matches) frame = requestAnimationFrame(update);
    };
    const pointer = (e: PointerEvent) => {
      if (preference.matches || e.pointerType !== "mouse" || !hero) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty(
        "--pointer-x",
        `${((e.clientX - r.left) / r.width - 0.5) * 14}px`,
      );
      hero.style.setProperty(
        "--pointer-y",
        `${((e.clientY - r.top) / r.height - 0.5) * 10}px`,
      );
    };
    const reset = () => {
      hero?.style.setProperty("--pointer-x", "0px");
      hero?.style.setProperty("--pointer-y", "0px");
    };
    const visibility = () => {
      element.dataset.motionPaused = String(document.hidden);
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    };
    const preferenceChanged = () => {
      reset();
      if (preference.matches) reveals.forEach(animation => animation.finish());
      if (preference.matches)
        scenes.forEach((s) => {
          s.style.setProperty("--scene-y", "0px");
          s.style.setProperty("--scene-y-back", "0px");
        });
      else schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    hero?.addEventListener("pointermove", pointer, { passive: true });
    hero?.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", preferenceChanged);
    schedule();
    return () => {
      visibilityObserver.disconnect();
      revealObserver.disconnect();
      reveals.forEach(animation => animation.cancel());
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      hero?.removeEventListener("pointermove", pointer);
      hero?.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", preferenceChanged);
    };
  }, [root]);
}
