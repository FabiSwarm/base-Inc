import type { ProductModel } from "@/types/product";

export const navigation = [
  { href: "#hero", label: "Die BASE Anzugshose" },
  { href: "#modelle", label: "Unsere Modelle" },
  { href: "#sizing", label: "Deine Länge" },
  { href: "#material", label: "Material & Alltag" },
] as const;

// Navigation prepared for the future legal pages; legal copy is not yet supplied.
export const legalNavigation = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "/widerruf", label: "Widerruf" },
] as const;

export const models = [
  { id: "base-i", name: "BASE I", fit: "Wide Leg", description: "Die BASE Anzugshose im weiten Schnitt. Für deinen Alltag." },
  { id: "base-ii", name: "BASE II", fit: "Straight Leg", description: "Die BASE Anzugshose im geraden Schnitt. Für deinen Alltag." },
] as const satisfies readonly ProductModel[];

export const content = {
  hero: { eyebrow: "DIE BASE ANZUGSHOSE", title: "Die Essenz von Stil.", cta: "Jetzt entdecken" },
  models: { title: "Zwei Schnitte. Eine Haltung." },
  sizing: {
    eyebrow: "SIZING",
    title: "Eine Größe. Deine Länge.",
    description: "Eine Einheitsgröße. Zwei Wege zur passenden Hosenlänge.",
    options: [
      { title: "Von uns gekürzt.", lines: ["Du misst deine Hosenlänge.", "Wir kürzen deine BASE auf dein Maß."] },
      { title: "Vor Ort angepasst.", lines: ["Du erhältst deine BASE ungekürzt.", "Eine Schneiderei kürzt sie auf deine Länge."] },
    ],
  },
  material: {
    eyebrow: "MATERIAL & ALLTAG",
    title: "Für jeden Tag gemacht.",
    description: "Fühlt sich gut an. Macht deinen Alltag mit.",
    benefits: "Weich. Waschbar. Bewegungsfreiheit.",
    cta: "BASE entdecken",
  },
} as const;
