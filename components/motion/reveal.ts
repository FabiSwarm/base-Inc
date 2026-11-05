import { gsap } from "gsap";
import { motion } from "@/lib/motion-config";

/** Called inside the story's matchMedia context, so all styles revert together. */
export function revealText(root: HTMLElement) {
  const cleanups: (() => void)[] = [];
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((group) => {
    // Deep links and restored scroll positions must never conceal existing text.
    if (group.getBoundingClientRect().top < window.innerHeight * 0.94) return;
    const targets = group.children.length ? Array.from(group.children) : [group];
    const tween = gsap.from(targets, {
      opacity: 0,
      y: motion.reveal.distance,
      duration: motion.reveal.duration,
      stagger: motion.reveal.stagger,
      ease: motion.reveal.ease,
      scrollTrigger: { trigger: group, start: "top 94%", once: true },
    });
    // A keyboard user may reach a control before its scroll trigger fires.
    const show = () => tween.progress(1);
    group.addEventListener("focusin", show);
    cleanups.push(() => group.removeEventListener("focusin", show));
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}
