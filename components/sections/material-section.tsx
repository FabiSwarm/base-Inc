import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";

export function MaterialSection() {
  return (
    <section id="material" className="material-section section" aria-labelledby="material-title" tabIndex={-1}>
      <div className="section-intro" data-reveal>
        <p className="eyebrow">{content.material.eyebrow}</p>
        <h2 id="material-title">{content.material.title}</h2>
        <p className="section-description">{content.material.description}</p>
      </div>
      <div className="product-frame material-frame" data-product="lay">
        <ProductImage asset="lay" sizes="(max-width: 767px) 88vw, (max-width: 1023px) 560px, 680px" />
      </div>
      <div className="material-caption" data-reveal>
        <p>{content.material.benefits}</p>
        <Button asChild variant="text"><a href="#modelle">{content.material.cta}</a></Button>
      </div>
    </section>
  );
}
