import { ProductModel } from "@/components/product/product-model";
import { content, models } from "@/lib/content";

export function ModelsSection() {
  return (
    <section id="modelle" className="models-section section" aria-labelledby="models-title" tabIndex={-1}>
      <h2 id="models-title" data-reveal>{content.models.title}</h2>
      <div className="models-grid">
        {models.map((model, index) => <ProductModel key={model.id} model={model} index={index} />)}
      </div>
    </section>
  );
}
