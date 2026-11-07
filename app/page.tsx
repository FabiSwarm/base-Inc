import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageReveals } from "@/components/motion/reveal";
import { HeroSection } from "@/components/sections/hero-section";
import { ModelsSection } from "@/components/sections/models-section";
import { SizingSection } from "@/components/sections/sizing-section";
import { MaterialSection } from "@/components/sections/material-section";

export default function Home() {
  return (
    <>
      <a href="#inhalt" className="skip-link">Zum Inhalt</a>
      <SiteHeader />
      <PageReveals>
        <main id="inhalt" tabIndex={-1}>
          <HeroSection />
          <ModelsSection />
          <SizingSection />
          <MaterialSection />
        </main>
        <SiteFooter />
      </PageReveals>
    </>
  );
}
