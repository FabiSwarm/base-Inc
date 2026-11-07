import { legalNavigation, navigation } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand" data-reveal="stagger">
          <a className="footer-wordmark" href="#hero" aria-label="BASE — zum Seitenanfang">BASE</a>
          <p>Die Essenz von Stil.</p>
        </div>
        <nav aria-labelledby="footer-discover" className="footer-nav" data-reveal>
          <h2 id="footer-discover" className="eyebrow">ENTDECKEN</h2>
          <ul>
            {navigation.map(({ href, label }) => <li key={href}><a href={href}>{label}</a></li>)}
          </ul>
        </nav>
        <nav aria-labelledby="footer-legal" className="footer-nav" data-reveal>
          <h2 id="footer-legal" className="eyebrow">RECHTLICHES</h2>
          <ul>
            {legalNavigation.map(({ href, label }) => <li key={href}><a href={href}>{label}</a></li>)}
          </ul>
        </nav>
      </div>
      <div className="footer-bottom" data-reveal>
        <small>© BASE</small>
        <a href="#hero">Zurück nach oben <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
