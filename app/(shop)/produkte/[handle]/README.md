# Produktdetailseite

Reservierter Platz für die spätere Route `/produkte/[handle]`, beispielsweise
`/produkte/base-i`, sofern dies der tatsächliche Shopify-Handle ist.

Hier entstehen bei der Integration `page.tsx`, `loading.tsx` und `not-found.tsx`.
Die Seite lädt Produktdaten serverseitig und verwendet die vorhandenen Bauteile
aus `components/product/`.

Die Gruppe `(shop)` erscheint nicht in der URL. Solange hier keine `page.tsx`
liegt, wird keine neue Produktseite veröffentlicht.

[Gesamtübersicht](../../../../lib/shopify/README.md)
