// CSS uses the same 768px breakpoint for the two-column layout.
export const motion = {
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
  reduced: "(prefers-reduced-motion: reduce)",
  reveal: { distance: 16, duration: 0.56, stagger: 0.08, ease: "power2.out" },
  scrub: 0.18,
  resizeDelay: 160,
  desktopStory: {
    modelLanding: 0.17,
    modelDeparture: 0.015,
    detailLanding: 0.28,
    detailDeparture: 0.03,
    materialLanding: 0.35,
    detailZoom: 1.22,
  },
  mobileImage: { distance: 12, scale: 0.98, viewportTravel: 0.22 },
} as const;
