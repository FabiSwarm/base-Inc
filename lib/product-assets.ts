import type { ProductAsset } from "@/types/product";

// Original files, including their transparent margins. Never recolor or crop.
export const productAssets = {
  front: {
    src: "/product/base_front.webp",
    width: 1024,
    height: 1536,
    alt: "Anthrazitfarbene BASE Anzugshose, vollständige Frontansicht ohne Model",
  },
  leg: {
    src: "/product/base_leg.webp",
    width: 1024,
    height: 1536,
    alt: "Einzelnes Hosenbein der BASE mit sichtbarer Stoffstruktur und Saum",
  },
  lay: {
    src: "/product/base_lay.webp",
    width: 1536,
    height: 1024,
    alt: "Gefaltete anthrazitfarbene BASE Anzugshose mit Bund und Knopf",
  },
} as const satisfies Record<string, ProductAsset>;

export type ProductAssetName = keyof typeof productAssets;
