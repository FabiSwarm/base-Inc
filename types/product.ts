export type ProductAsset = {
  src: `/product/${string}.webp`;
  width: number;
  height: number;
  alt: string;
};

export type ProductModel = {
  id: "base-i" | "base-ii";
  name: string;
  fit: "Wide Leg" | "Straight Leg";
  description: string;
  href?: string;
};
