# BASE

Responsive Landingpage mit Next.js 16, React 19, TypeScript, Tailwind CSS 4 und angepassten shadcn/Radix-Primitives. Der Shop ist noch nicht an ein Backend angebunden.

## Starten

```bash
pnpm install
pnpm dev
```

Die Seite läuft unter http://localhost:3000. Für einen Produktionsstart: `pnpm build` und anschließend `pnpm start`. `next/font` lädt die freie Geist-Schrift beim Build und liefert sie anschließend selbst aus; der erste Build benötigt dafür Netzwerkzugriff.

## Gestaltung und Inhalte

- `app/globals.css`: Design-Tokens, responsive Layouts, Hero-Bodenschatten (`--hero-shadow-*`) und Footer.
- `lib/product-assets.ts`: tatsächliche Dateien und Bildabmessungen aus `public/product/`. Beide Modelle verwenden dieselbe unveränderte Frontansicht.
- `lib/content.ts`: Seiteninhalte, Modelldaten, Hauptnavigation und Legal-Links.
- `components/layout/site-footer.tsx`: Footer mit Entdecken- und Rechtliches-Navigation.
- `lib/motion-config.ts`: Fade-Dauer, Stagger, Ease und Auslöseabstand.
- `components/motion/reveal.tsx`: einmalige GSAP-Fade-ins über IntersectionObserver. Ausschließlich Deckkraft; keine Produktfahrten, Zooms, Bildkopien, Pins oder Scroll-Timelines. Sichtbare Startinhalte bleiben direkt sichtbar. Reduzierte Bewegung, Tastaturfokus, Anker und fehlendes JavaScript werden berücksichtigt.

Die vorhandene `app/`-Struktur und die Next.js-Konfiguration bleiben erhalten. Die Abschnitte und der Footer sind Server Components; Animationen, Sheets und Dialoge bilden gezielte Client-Grenzen.

## Prüfungen

```bash
pnpm typecheck
pnpm lint
pnpm build
# In einem zweiten Terminal, während pnpm dev läuft:
pnpm test:e2e
```

Die Browser-Tests verwenden den installierten Google Chrome und prüfen 1440, 1024, 768, 390 und 360 px. Sie prüfen Layout, Bilder, Footer-Navigation, Dialoge, Tastaturfokus, Fade-ins, Reload, Resize, reduzierte Bewegung, deaktiviertes JavaScript und automatisierte Accessibility-Regeln. `PLAYWRIGHT_BASE_URL` kann einen anderen Testserver setzen. Mit `PLAYWRIGHT_CHANNEL=chromium` lässt sich alternativ ein über Playwright installierter Chromium verwenden.

Screenshots liegen nach dem Testlauf unter `artifacts/screenshots/`, der HTML-Bericht unter `playwright-report/`. Diese generierten Dateien sind nicht für die Versionsverwaltung vorgesehen.

## Noch offen

- Die Legal-Links `/impressum`, `/datenschutz`, `/agb` und `/widerruf` sind als Navigation vorbereitet. Die Zielseiten und freigegebenen Rechtstexte sind ausdrücklich noch nicht implementiert.
- Die Messanleitung ist ein gekennzeichneter Entwurf; Messmethode und Messpunkte müssen noch freigegeben werden.
- Produktseiten, Preise, Verfügbarkeit, Warenkorb, Bestellung und Shop-API folgen. Bis dahin zeigen die Modell-Dialoge bekannte Angaben und der Warenkorb einen ehrlichen leeren Zustand.
