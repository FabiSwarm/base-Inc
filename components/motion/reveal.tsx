"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { motion } from "@/lib/motion-config";

/** Opacity-only enhancement; server-rendered content is visible by default. */
export function PageReveals({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia(root);

    try {
      media.add({ animate: motion.enabled, reduced: motion.reduced }, (context) => {
        root.dataset.motion = context.conditions?.reduced ? "reduced" : "fade";
        if (context.conditions?.reduced || !("IntersectionObserver" in window)) return;

        const reveals = new Map<Element, gsap.core.Tween>();
        const show = (element: Element, immediately = false) => {
          const tween = reveals.get(element);
          if (!tween) return;
          if (immediately) tween.progress(1);
          else tween.play();
          observer.unobserve(element);
        };
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) show(entry.target);
          });
        }, { rootMargin: `0px 0px -${motion.reveal.inset}px 0px`, threshold: 0 });

        root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((group) => {
          // Keep the first viewport, deep links and restored content visible.
          if (group.getBoundingClientRect().top < window.innerHeight) return;
          const targets = group.dataset.reveal === "stagger" ? Array.from(group.children) : [group];
          const tween = gsap.fromTo(targets, { opacity: 0 }, {
            opacity: 1,
            duration: motion.reveal.duration,
            stagger: motion.reveal.stagger,
            ease: motion.reveal.ease,
            paused: true,
            clearProps: "opacity",
          });
          reveals.set(group, tween);
          observer.observe(group);
        });

        // Focus and anchor navigation must never land on concealed controls.
        const revealWithin = (target: Element) => {
          reveals.forEach((_, group) => {
            if (group.contains(target) || target.contains(group)) show(group, true);
          });
        };
        const onFocus = (event: FocusEvent) => {
          if (event.target instanceof Element) revealWithin(event.target);
        };
        const onHashChange = () => {
          const target = document.getElementById(window.location.hash.slice(1));
          if (target) revealWithin(target);
        };
        root.addEventListener("focusin", onFocus);
        window.addEventListener("hashchange", onHashChange);
        onHashChange();

        return () => {
          observer.disconnect();
          root.removeEventListener("focusin", onFocus);
          window.removeEventListener("hashchange", onHashChange);
        };
      });
    } catch (error) {
      media.revert();
      root.dataset.motion = "static";
      console.error("BASE: Fade-ins konnten nicht initialisiert werden.", error);
    }

    return () => {
      media.revert();
      delete root.dataset.motion;
    };
  }, []);

  return <div ref={rootRef} className="page-content">{children}</div>;
}
