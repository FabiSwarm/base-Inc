import { SiteHeader } from "@/components/layout/site-header";
import { ProductStory } from "@/components/motion/product-story";
import { HeroSection } from "@/components/sections/hero-section";
import { ModelsSection } from "@/components/sections/models-section";
import { SizingSection } from "@/components/sections/sizing-section";
import { MaterialSection } from "@/components/sections/material-section";

export default function Home() {
  return (
    <>
      <a href="#inhalt" className="skip-link">Zum Inhalt</a>
      <SiteHeader />
      <main id="inhalt" tabIndex={-1}>
        <ProductStory>
          <HeroSection />
          <ModelsSection />
          <SizingSection />
          <MaterialSection />
        </ProductStory>
      </main>
    </>
  );
}
