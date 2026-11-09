# Shopify-Anbindung

Vorbereitete Ordnerstruktur für einen Headless-Shop mit der Shopify Storefront API.
Es gibt hier noch keinen API-Client, keine laufenden Anfragen und keine Verbindung
zum Shop. Alle nachfolgend genannten TypeScript-Dateien sind geplante Dateien.

## Wo kommt was hin?

| Ordner | Aufgabe | Geplante Dateien |
| --- | --- | --- |
| `lib/shopify/` | Serverzugriff, Konfiguration und Funktionen für die Seite | `client.ts`, `config.ts`, `products.ts`, `cart.ts` |
| `lib/shopify/queries/` | GraphQL-Abfragen zum Lesen von Produkten und Warenkörben | `products.ts`, `cart.ts` |
| `lib/shopify/mutations/` | GraphQL-Operationen zum Erstellen und Ändern von Warenkörben | `cart.ts` |
| `lib/shopify/fragments/` | Gemeinsam verwendete GraphQL-Felder | `product.ts`, `cart.ts`, `money.ts` |
| `lib/shopify/types/` | Typen der API-Antworten und Eingaben | `product.ts`, `cart.ts`, `graphql.ts` |
| `lib/shopify/mappers/` | Übersetzung von Shopify-Daten in Daten für die Oberfläche | `product.ts`, `cart.ts` |
| `app/_actions/shopify/` | Server Actions für Benutzeraktionen wie „In den Warenkorb“ | `cart.ts` |
| `app/(shop)/produkte/[handle]/` | Spätere Produktdetailseiten | `page.tsx`, `loading.tsx`, `not-found.tsx` |
| `components/cart/` | Warenkorbpositionen, Mengensteuerung und Checkout-Button | `cart-line.tsx`, `cart-summary.tsx` |
| `components/product/` (vorhanden) | Produktdarstellung und spätere Variantenauswahl | Bestehende Komponenten erweitern |

Die README-Dateien erklären die Zuständigkeiten und sorgen dafür, dass Git die
noch nicht mit Code gefüllten Ordner mitführt.

## Geplanter Datenfluss

- Produktseite oder Server Component → `products.ts` → `client.ts` → Shopify.
- Warenkorb-Button → Server Action → `cart.ts` → `client.ts` → Shopify.
- API-Antwort → Mapper → Produkt- oder Warenkorb-Komponente.
- Checkout-Button → die von Shopify gelieferte `checkoutUrl`.

Die vorhandene Warenkorb-Schublade in `components/layout/cart-sheet.tsx` bleibt
der Einstieg für den Warenkorb. Die neuen Bauteile werden später darin verwendet.
`lib/content.ts` enthält weiterhin die redaktionellen Texte.
`types/product.ts` beschreibt bislang die lokalen Präsentationsdaten und wird
nicht durch einen ungeprüften Shopify-Datentyp ersetzt.

## Konfiguration

Die Vorlage liegt in [`.env.example`](../../.env.example). Später nach
`.env.local` kopieren und Shop-Domain sowie privaten Storefront-Token eintragen.
Die Vorlage verwendet die am 09.11.2026 aktuelle stabile API-Version `2026-10`;
vor der eigentlichen Integration Version und Schema erneut prüfen.

Geplant ist ein serverseitiger API-Zugriff. `config.ts`, `client.ts` und die
Zugriffsfunktionen werden mit `import "server-only"` gekennzeichnet.
Private Zugangsdaten gehören nicht in Client Components oder `NEXT_PUBLIC_*`.
Die Konfiguration erst beim tatsächlichen API-Zugriff prüfen, damit die
Landingpage bis zur Anbindung ohne Shopify-Zugangsdaten weiter funktioniert.

## Reihenfolge der späteren Integration

1. Storefront-Zugang und veröffentlichte Produkte/Varianten im Shopify-Shop vorbereiten.
2. Konfiguration und GraphQL-Client mit Behandlung von HTTP- und GraphQL-Fehlern implementieren.
3. Produktabfragen, Typen und Mapper anhand des festgelegten Schemas ergänzen.
4. BASE I und BASE II ihren tatsächlichen Shopify-Handles bzw. Varianten zuordnen.
5. Warenkorb lesen, erstellen und Positionen hinzufügen, ändern oder entfernen.
6. Warenkorb-ID in einem serverseitig verwalteten Cookie speichern; Warenkorbdaten
   nicht über einen gemeinsamen Cache zwischen Besuchern teilen.
7. Server Actions mit Eingabeprüfung und Shopify-`userErrors` an die Oberfläche anbinden.
8. Produktseiten und Weiterleitung zum Shopify-Checkout aktivieren.

Die gewünschte Hosenlänge und Kürzungsoption müssen vor Schritt 4 fachlich
festgelegt werden: Welche Angaben sind Varianten, welche Positionsattribute?
Es werden dafür noch keine Produktdaten oder IDs erfunden.

## Referenzen

- [Shopify Storefront API: Authentifizierung, Versionen und GraphQL](https://shopify.dev/docs/api/storefront/latest)
- [Shopify: Warenkorb erstellen, aktualisieren und Checkout-URL abrufen](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage)
- Lokale Next.js-Anleitung: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- Lokale Server-/Client-Anleitung: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
