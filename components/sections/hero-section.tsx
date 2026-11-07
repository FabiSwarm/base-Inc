import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";

export function HeroSection() {
  return (
    <section id="hero" className="hero-section section" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="product-frame hero-frame" data-product="hero">
        <ProductImage asset="front" preload sizes="(max-width: 767px) 250px, (max-width: 1023px) 360px, 440px" />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1 id="hero-title">{content.hero.title}</h1>
        <Button asChild><a href="#modelle">{content.hero.cta}</a></Button>
      </div>
    </section>
  );
}
