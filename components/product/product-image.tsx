import Image from "next/image";
import { productAssets, type ProductAssetName } from "@/lib/product-assets";
import { cn } from "@/lib/utils";

type Props = { asset: ProductAssetName; className?: string; sizes: string; preload?: boolean; decorative?: boolean };

export function ProductImage({ asset, className, sizes, preload = false, decorative = false }: Props) {
  const image = productAssets[asset];
  return (
    <Image src={image.src} width={image.width} height={image.height}
      alt={decorative ? "" : image.alt} aria-hidden={decorative || undefined}
      sizes={sizes} preload={preload} quality={90} draggable={false}
      className={cn("product-image", className)} />
  );
}
