import { ProductImage } from "@/components/product/product-image";
import { MeasurementGuideDialog } from "@/components/sizing/measurement-guide-dialog";
import { content } from "@/lib/content";
import "./sizing-section.css";

export function SizingSection() {
  return (
    <section id="sizing" className="sizing-section section" aria-labelledby="sizing-title" tabIndex={-1}>
      <div className="section-intro" data-reveal="stagger">
        <p className="eyebrow">{content.sizing.eyebrow}</p>
        <h2 id="sizing-title">{content.sizing.title}</h2>
        <p className="section-description">{content.sizing.description}</p>
      </div>
      <div className="product-frame sizing-frame" data-product="leg" data-reveal>
        <ProductImage asset="leg" sizes="(max-width: 767px) 150px, 240px" />
      </div>
      <div className="sizing-options">
        {content.sizing.options.map((option, index) => (
          <div className="sizing-option" data-reveal="stagger" key={option.title}>
            <h3>{option.title}</h3>
            <p>{option.lines[0]}<br />{option.lines[1]}</p>
            {index === 0 && <MeasurementGuideDialog />}
          </div>
        ))}
      </div>
    </section>
  );
}
