import { MessageCircle, Scissors, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShippingInfoDialog } from "@/components/service/shipping-info-dialog";
import { content } from "@/lib/content";
import "./service-section.css";

export function ServiceSection() {
  const service = content.service;

  return (
    <section id="service" className="service-section" aria-labelledby="service-title">
      <div className="section service-inner">
        <h2 id="service-title" className="sr-only">Service & Neuigkeiten</h2>
        <div className="service-grid">
          <article className="service-card" data-reveal>
            <MessageCircle className="service-icon" size={30} strokeWidth={1.25} aria-hidden="true" />
            <h3>{service.fit.title}</h3>
            <p>{service.fit.description}</p>
            <Button asChild variant="text"><a href="#modelle">{service.fit.cta}</a></Button>
          </article>
          <article className="service-card" data-reveal>
            <Truck className="service-icon" size={30} strokeWidth={1.25} aria-hidden="true" />
            <h3>{service.shipping.title}</h3>
            <p>{service.shipping.description}</p>
            <ShippingInfoDialog />
          </article>
          <article className="service-card" data-reveal>
            <Scissors className="service-icon" size={30} strokeWidth={1.25} aria-hidden="true" />
            <h3>{service.alterations.title}</h3>
            <p>{service.alterations.description}</p>
            <Button asChild variant="text"><a href="#sizing">{service.alterations.cta}</a></Button>
          </article>
        </div>
        <div className="newsletter" data-reveal>
          <div className="newsletter-copy">
            <p className="eyebrow">{service.newsletter.eyebrow}</p>
            <h3 id="newsletter-title">{service.newsletter.title}</h3>
            <p>{service.newsletter.description}</p>
          </div>
          <form className="newsletter-form" aria-labelledby="newsletter-title">
            <label htmlFor="newsletter-email" className="sr-only">Deine E-Mail-Adresse</label>
            <div className="newsletter-field">
              <input id="newsletter-email" name="email" type="email" autoComplete="email"
                placeholder="Deine E-Mail-Adresse" aria-describedby="newsletter-note" disabled />
              <Button variant="outline" type="submit" disabled>Abonnieren</Button>
            </div>
            <p id="newsletter-note">{service.newsletter.note}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
