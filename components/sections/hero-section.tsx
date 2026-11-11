import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";
import "./hero-section.css";

export function HeroSection() {
  return (
    <section id="hero" className="hero-section section" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="hero-stage">
        <div className="hero-aside hero-aside--left">
          <p className="hero-aside-title">{content.hero.left.title}</p>
          <p>{content.hero.left.description}</p>
        </div>
        <div className="product-frame hero-frame" data-product="hero">
          <ProductImage asset="front" preload sizes="(max-width: 767px) 280px, (max-width: 1023px) 380px, 520px" />
        </div>
        <div className="hero-aside hero-aside--right">
          <p className="hero-aside-title">{content.hero.right.title}</p>
          <p>{content.hero.right.description}</p>
        </div>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1 id="hero-title">{content.hero.title}</h1>
        <Button asChild><a href="#modelle">{content.hero.cta}</a></Button>
      </div>
    </section>
  );
}
