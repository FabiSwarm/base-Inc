import type { ProductModel } from "@/types/product";

export const navigation = [
  { href: "#hero", label: "Die ASSISE Anzugshose" },
  { href: "#modelle", label: "Unsere Modelle" },
  { href: "#sizing", label: "Deine Länge" },
  { href: "#material", label: "Material" },
] as const;

// Navigation prepared for the future legal pages; legal copy is not yet supplied.
export const legalNavigation = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "/widerruf", label: "Widerruf" },
] as const;

export const models = [
  { id: "base-i", name: "ASSISE I", fit: "Wide Leg", description: "Der Wide-Leg-Schnitt fällt vom Oberschenkel bis zum Saum weit und verleiht der Hose eine fließende Silhouette." },
  { id: "base-ii", name: "ASSISE II", fit: "Straight Leg", description: "Der Straight-Leg-Schnitt verläuft vom Knie bis zum Saum gerade und sorgt für eine klare, klassische Silhouette." },
] as const satisfies readonly ProductModel[];

export const content = {
  hero: {
    eyebrow: "DIE ASSISE ANZUGSHOSE", title: "Die Essenz von Stil.", cta: "Jetzt entdecken",
    left: { title: "Zwei Schnitte.", description: "Wide Leg / Straight Leg" },
    right: { title: "Deine Länge.", description: "Individuell gekürzt." },
  },
  models: { title: "Zwei Schnitte. Eine Haltung." },
  sizing: {
    eyebrow: "SIZING",
    title: "Eine Größe. Deine Länge.",
    description: "Eine Einheitsgröße. Zwei Wege zur passenden Hosenlänge.",
    options: [
      { title: "Von uns gekürzt.", lines: ["Du misst deine Hosenlänge.", "Wir kürzen deine ASSISE auf dein Maß."] },
      { title: "Vor Ort angepasst.", lines: ["Du erhältst deine ASSISE ungekürzt.", "Eine Schneiderei kürzt sie auf deine Länge."] },
    ],
  },
  material: {
    eyebrow: "MATERIAL",
    title: "Für jeden Tag gemacht.",
    description: "Fühlt sich gut an. Macht deinen Alltag mit.",
    benefits: { before: "Weich.", emphasis: "Waschbar.", after: "Bewegungsfreiheit." },
    cta: "ASSISE entdecken",
  },
  service: {
    fit: {
      title: "Dein Schnitt. Dein Stil.",
      description: "Wide Leg oder Straight Leg? Lerne unsere beiden Schnitte kennen und finde die Silhouette, die zu dir passt.",
      cta: "Schnitte vergleichen",
    },
    shipping: {
      title: "Versand & Rücksendung",
      description: "Lieferzeiten, Versandkosten und Rücksendung. Hier findest du zum Shopstart alle Informationen auf einen Blick.",
      cta: "Mehr zum Versand",
    },
    alterations: {
      title: "Auf deine Länge.",
      description: "Von uns auf dein Maß gekürzt oder bei einer Schneiderei vor Ort angepasst. Du entscheidest, welcher Weg zu dir passt.",
      cta: "Längenoptionen ansehen",
    },
    newsletter: {
      eyebrow: "POST VON ASSISE",
      title: "Bleib auf dem Laufenden.",
      description: "Neue Modelle, Einblicke und Neuigkeiten rund um ASSISE.",
      note: "Newsletter-Anmeldung ab Shopstart.",
    },
  },
} as const;
