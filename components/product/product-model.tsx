import type { ProductModel as Model } from "@/types/product";
import { ProductImage } from "@/components/product/product-image";
import { ProductDetailsDialog } from "@/components/product/product-details-dialog";
import { Button } from "@/components/ui/button";

export function ProductModel({ model, index }: { model: Model; index: number }) {
  return (
    <article className="product-model" aria-labelledby={`${model.id}-title`}>
      <p className="model-description" data-reveal>{model.description}</p>
      <div className="product-frame model-frame" data-product={index === 0 ? "left" : "right"} data-reveal>
        <ProductImage asset="front" sizes="(max-width: 767px) 260px, (max-width: 1023px) 300px, 400px" />
      </div>
      <div className="model-caption" data-reveal="stagger">
        <h3 id={`${model.id}-title`}>{model.name}</h3>
        <p>{model.fit}</p>
        {model.href ? <Button asChild variant="primary"><a href={model.href}>Entdecken</a></Button> : <ProductDetailsDialog model={model} />}
      </div>
    </article>
  );
}
