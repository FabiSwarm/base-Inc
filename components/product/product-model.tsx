import type { ProductModel as Model } from "@/types/product";
import { ProductImage } from "@/components/product/product-image";
import { ProductDetailsDialog } from "@/components/product/product-details-dialog";
import { Button } from "@/components/ui/button";

export function ProductModel({ model, index }: { model: Model; index: number }) {
  return (
    <article className="product-model" aria-labelledby={`${model.id}-title`}>
      <div className="product-frame model-frame" data-product={index === 0 ? "left" : "right"}>
        <ProductImage asset="front" sizes="(max-width: 767px) 190px, (max-width: 1023px) 270px, 350px" />
      </div>
      <div className="model-caption" data-reveal>
        <h3 id={`${model.id}-title`}>{model.name}</h3>
        <p>{model.fit}</p>
        {model.href ? <Button asChild variant="text"><a href={model.href}>Entdecken</a></Button> : <ProductDetailsDialog model={model} />}
      </div>
    </article>
  );
}
