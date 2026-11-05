"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealText } from "@/components/motion/reveal";
import { motion } from "@/lib/motion-config";

type FrameName = "hero" | "left" | "right" | "leg" | "lay";
type Frame = { element: HTMLElement; x: number; y: number; width: number; height: number };

function desktopStory(root: HTMLElement, overlay: HTMLElement) {
  const rootBounds = root.getBoundingClientRect();
  const origin = rootBounds.top + window.scrollY;
  const viewport = window.innerHeight;
  const frames = Object.fromEntries(
    (["hero", "left", "right", "leg", "lay"] as const).map((name) => {
      const element = root.querySelector<HTMLElement>(`[data-product="${name}"]`)!;
      const bounds = element.getBoundingClientRect();
      return [name, { element, x: bounds.left - rootBounds.left, y: bounds.top - rootBounds.top, width: bounds.width, height: bounds.height }];
    }),
  ) as Record<FrameName, Frame>;
  const { hero, left, right, leg, lay } = frames;
  const config = motion.desktopStory;
  const firstEnd = Math.max(1, origin + left.y - viewport * config.modelLanding);
  const secondStart = Math.max(firstEnd + 1, origin + left.y - viewport * config.modelDeparture);
  const secondEnd = Math.max(secondStart + 1, origin + leg.y - viewport * config.detailLanding);
  const thirdStart = Math.max(secondEnd + 1, origin + leg.y - viewport * config.detailDeparture);
  const maxScroll = document.documentElement.scrollHeight - viewport;
  const thirdEnd = Math.max(thirdStart + 1, Math.min(maxScroll - 16, origin + lay.y - viewport * config.materialLanding));
  const secondDuration = secondEnd - secondStart;
  const thirdDuration = thirdEnd - thirdStart;

  // Clone the actual responsive image, preserving srcset, alpha and decoded cache.
  // The clones are decorative; informative originals retain their alt text.
  function sprite(frame: Frame) {
    const node = document.createElement("div");
    node.className = "story-sprite";
    const image = frame.element.querySelector("img")!.cloneNode(true) as HTMLImageElement;
    image.alt = "";
    image.removeAttribute("id");
    node.append(image);
    overlay.append(node);
    gsap.set(node, { width: frame.width, height: frame.height, x: frame.x, y: frame.y });
    return node;
  }
  const first = sprite(hero);
  const second = sprite(hero);
  const detail = sprite(leg);
  const folded = sprite(lay);
  const pose = (frame: Frame) => ({ x: frame.x, y: frame.y, scale: frame.width / hero.width });

  // One owner for all desktop product transforms and opacities. Timeline units
  // equal scroll pixels; no pin spacer, scroll interception or per-frame reads.
  const story = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: root, start: 0, end: thirdEnd, scrub: motion.scrub },
  });

  story
    .set([hero.element, left.element, right.element], { opacity: 0 }, 0)
    .set(first, { ...pose(hero), opacity: 1, willChange: "transform, opacity" }, 0)
    .set(second, { ...pose(hero), opacity: 0, willChange: "transform, opacity" }, 0)
    .to(root.querySelector("[data-hero-copy]"), { opacity: 0, y: -8, duration: firstEnd * 0.19 }, firstEnd * 0.02)
    .to(first, { ...pose(left), duration: firstEnd * 0.78 }, firstEnd * 0.12)
    .to(second, { ...pose(right), duration: firstEnd * 0.78 }, firstEnd * 0.12)
    .to(second, { opacity: 1, duration: firstEnd * 0.16 }, firstEnd * 0.16)
    .set([hero.element, left.element, right.element], { opacity: 1 }, firstEnd)
    .set([first, second], { opacity: 0, willChange: "auto" }, firstEnd);

  // Focus on the lower right leg. The separate detail takes over before a
  // large zoom would soften the front view. No forced perspective morphing.
  const zoom = (left.width / hero.width) * config.detailZoom;
  const focus = {
    x: leg.x + leg.width * 0.5 - hero.width * zoom * 0.65,
    y: leg.y + leg.height * 0.97 - hero.height * zoom * 0.97,
    scale: zoom,
  };
  story
    .set([left.element, right.element, leg.element], { opacity: 0 }, secondStart)
    .set(first, { ...pose(left), opacity: 1, willChange: "transform, opacity" }, secondStart)
    .set(second, { ...pose(right), opacity: 1, willChange: "opacity" }, secondStart)
    .set(detail, { x: leg.x, y: leg.y, scale: 1, opacity: 0, willChange: "opacity" }, secondStart)
    .to(second, { opacity: 0, duration: secondDuration * 0.18 }, secondStart)
    .to(first, { ...focus, duration: secondDuration * 0.65 }, secondStart)
    .to(first, { opacity: 0, duration: secondDuration * 0.2 }, secondStart + secondDuration * 0.5)
    .to(detail, { opacity: 1, duration: secondDuration * 0.22 }, secondStart + secondDuration * 0.5)
    .set([left.element, right.element, leg.element], { opacity: 1 }, secondEnd)
    .set([first, second, detail], { opacity: 0, willChange: "auto" }, secondEnd);

  story
    .set([leg.element, lay.element], { opacity: 0 }, thirdStart)
    .set(detail, { x: leg.x, y: leg.y, scale: 1, opacity: 1, willChange: "transform, opacity" }, thirdStart)
    .set(folded, { opacity: 0, willChange: "opacity" }, thirdStart)
    .to(detail, { x: leg.x + leg.width * 0.04, y: leg.y + leg.height * 0.04, scale: 0.92, opacity: 0, duration: thirdDuration * 0.55 }, thirdStart)
    .to(folded, { opacity: 1, duration: thirdDuration * 0.5 }, thirdStart + thirdDuration * 0.3)
    .set([leg.element, lay.element], { opacity: 1 }, thirdEnd)
    .set([detail, folded], { opacity: 0, willChange: "auto" }, thirdEnd);

  return () => overlay.replaceChildren();
}

export function ProductStory({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const overlay = overlayRef.current;
    if (!root || !overlay) return;
    gsap.registerPlugin(ScrollTrigger);
    let media: gsap.MatchMedia | undefined;
    let timer: ReturnType<typeof setTimeout>;
    let frame = 0;
    let disposed = false;

    const build = () => {
      if (disposed) return;
      media?.revert();
      overlay.replaceChildren();
      try {
        media = gsap.matchMedia(root);
        media.add({ desktop: motion.desktop, mobile: motion.mobile, reduced: motion.reduced }, (context) => {
          const { desktop, reduced } = context.conditions!;
          root.dataset.motion = reduced ? "reduced" : desktop ? "desktop" : "mobile";
          if (reduced) return;
          const clearReveals = revealText(root);
          let clearStory: (() => void) | undefined;
          if (desktop) {
            clearStory = desktopStory(root, overlay);
          } else {
            // Each mobile image settles once it arrives; no horizontal travel,
            // pinning or text disappearing on its way out of the viewport.
            root.querySelectorAll<HTMLElement>("[data-product]:not([data-product='hero'])").forEach((product) => {
              gsap.from(product, {
                opacity: 0.65, y: motion.mobileImage.distance, scale: motion.mobileImage.scale, ease: "none",
                scrollTrigger: { trigger: product, start: "top 98%", end: `top ${98 - motion.mobileImage.viewportTravel * 100}%`, scrub: motion.scrub },
              });
            });
          }
          return () => { clearStory?.(); clearReveals(); };
        });
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      } catch (error) {
        // Progressive enhancement: reverting the context restores every original.
        media?.revert();
        overlay.replaceChildren();
        root.dataset.motion = "static";
        console.error("BASE: Scroll-Animationen konnten nicht initialisiert werden.", error);
      }
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(build, motion.resizeDelay);
    };

    build();
    // These reads only happen on setup, image/font readiness and actual resize.
    let width = root.clientWidth;
    let height = root.clientHeight;
    const observer = new ResizeObserver(([entry]) => {
      const { width: nextWidth, height: nextHeight } = entry.contentRect;
      if (Math.abs(nextWidth - width) < 1 && Math.abs(nextHeight - height) < 1) return;
      width = nextWidth; height = nextHeight; schedule();
    });
    observer.observe(root);
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(() => { if (!disposed) schedule(); });

    const images = Array.from(root.querySelectorAll<HTMLImageElement>("[data-product] img"));
    images.forEach((image) => image.addEventListener("load", schedule));
    // Only the next nearby motifs are requested ahead of their transition.
    const upcoming = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll("img").forEach((image) => { image.loading = "eager"; });
        upcoming.unobserve(entry.target);
      });
    }, { rootMargin: "75% 0px" });
    root.querySelectorAll("[data-product]").forEach((product) => upcoming.observe(product));

    return () => {
      disposed = true;
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      upcoming.disconnect();
      window.removeEventListener("resize", schedule);
      images.forEach((image) => image.removeEventListener("load", schedule));
      media?.revert();
      overlay.replaceChildren();
      delete root.dataset.motion;
    };
  }, []);

  return (
    <div ref={rootRef} className="product-story">
      {children}
      <div ref={overlayRef} className="story-overlay" aria-hidden="true" />
    </div>
  );
}
