export const motion = {
  enabled: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  reveal: { duration: 0.65, stagger: 0.08, ease: "power2.out", inset: 28 },
} as const;
