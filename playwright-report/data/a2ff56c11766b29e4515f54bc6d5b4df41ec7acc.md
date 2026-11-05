# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.ts >> both models and measurement draft open accessible dialogs
- Location: tests/e2e/landing.spec.ts:71:5

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: locator('.product-story')
Expected pattern: /desktop|mobile|reduced/
Received string:  ""
Timeout: 8000ms

Call log:
  - Expect "toHaveAttribute" locator('.product-story') with timeout 8000ms
  - waiting for locator('.product-story')
    19 × locator resolved to <div class="product-story">…</div>
       - unexpected value "null"

```

```yaml
- region "Die Essenz von Stil.":
  - img "Anthrazitfarbene BASE Anzugshose, vollständige Frontansicht ohne Model"
  - paragraph: DIE BASE ANZUGSHOSE
  - heading "Die Essenz von Stil." [level=1]
  - link "Jetzt entdecken":
    - /url: "#modelle"
- region "Zwei Schnitte. Eine Haltung.":
  - heading "Zwei Schnitte. Eine Haltung." [level=2]
  - article "BASE I"
  - article "BASE II"
- region "Eine Größe. Deine Länge.":
  - paragraph: SIZING
  - heading "Eine Größe. Deine Länge." [level=2]
  - paragraph: Eine Einheitsgröße. Zwei Wege zur passenden Hosenlänge.
  - img "Einzelnes Hosenbein der BASE mit sichtbarer Stoffstruktur und Saum"
  - heading "Von uns gekürzt." [level=3]
  - paragraph: Du misst deine Hosenlänge. Wir kürzen deine BASE auf dein Maß.
  - button "Hosenlänge messen"
  - heading "Vor Ort angepasst." [level=3]
  - paragraph: Du erhältst deine BASE ungekürzt. Eine Schneiderei kürzt sie auf deine Länge.
- region "Für jeden Tag gemacht.":
  - paragraph: MATERIAL & ALLTAG
  - heading "Für jeden Tag gemacht." [level=2]
  - paragraph: Fühlt sich gut an. Macht deinen Alltag mit.
  - img "Gefaltete anthrazitfarbene BASE Anzugshose mit Bund und Knopf"
  - paragraph: Weich. Waschbar. Bewegungsfreiheit.
  - link "BASE entdecken":
    - /url: "#modelle"
```

# Test source

```ts
  1   | import { test, expect, type Page } from "@playwright/test";
  2   | import AxeBuilder from "@axe-core/playwright";
  3   | 
  4   | async function ready(page: Page) {
  5   |   await page.goto("/");
  6   |   await page.locator(".product-story").waitFor();
> 7   |   await expect(page.locator(".product-story")).toHaveAttribute("data-motion", /desktop|mobile|reduced/);
      |                                                ^ Error: expect(locator).toHaveAttribute(expected) failed
  8   |   await page.evaluate(() => document.fonts.ready);
  9   | }
  10  | 
  11  | async function jump(page: Page, y: number) {
  12  |   await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  13  |   await page.waitForTimeout(450); // Allow the deliberately smoothed scrub to settle.
  14  | }
  15  | 
  16  | async function noOverflow(page: Page) {
  17  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  18  | }
  19  | 
  20  | test("static reference layout, imagery, centering and responsive order", async ({ page }, testInfo) => {
  21  |   await page.emulateMedia({ reducedMotion: "reduce" });
  22  |   await ready(page);
  23  |   await expect(page.locator("main section")).toHaveCount(4);
  24  |   await expect(page.locator("h1")).toHaveText("Die Essenz von Stil.");
  25  |   await expect(page.locator(".story-sprite")).toHaveCount(0);
  26  |   const logo = await page.locator(".wordmark").boundingBox();
  27  |   const header = await page.locator(".site-header").boundingBox();
  28  |   expect(Math.abs(logo!.x + logo!.width / 2 - (header!.x + header!.width / 2))).toBeLessThan(1);
  29  |   const left = await page.locator('[data-product="left"]').boundingBox();
  30  |   const right = await page.locator('[data-product="right"]').boundingBox();
  31  |   if (testInfo.project.use.viewport!.width < 768) {
  32  |     expect(right!.y).toBeGreaterThan(left!.y + left!.height);
  33  |     expect(Math.abs(left!.x - right!.x)).toBeLessThan(1);
  34  |   } else {
  35  |     expect(Math.abs(left!.y - right!.y)).toBeLessThan(1);
  36  |     expect(right!.x).toBeGreaterThan(left!.x + left!.width);
  37  |   }
  38  |   const images = page.locator("[data-product] img");
  39  |   for (const image of await images.all()) {
  40  |     await image.scrollIntoViewIfNeeded();
  41  |     await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  42  |     expect(await image.evaluate((img) => getComputedStyle(img).objectFit)).toBe("contain");
  43  |     expect(await image.evaluate((img) => getComputedStyle(img).filter)).toBe("none");
  44  |   }
  45  |   await noOverflow(page);
  46  |   await jump(page, 0);
  47  |   await page.screenshot({ path: `artifacts/screenshots/${testInfo.project.name}-static.png`, fullPage: true });
  48  | });
  49  | 
  50  | test("navigation, native anchors, cart and focus restoration", async ({ page }) => {
  51  |   await ready(page);
  52  |   await page.getByRole("button", { name: "Menü", exact: true }).click();
  53  |   const sheet = page.getByRole("dialog");
  54  |   await expect(sheet).toBeVisible();
  55  |   await expect(sheet.getByRole("navigation").getByRole("link")).toHaveCount(4);
  56  |   await sheet.getByRole("link", { name: "Deine Länge" }).click();
  57  |   await expect(sheet).toBeHidden();
  58  |   await expect(page).toHaveURL(/#sizing$/);
  59  |   await expect(page.locator("#sizing")).toBeFocused();
  60  |   await jump(page, 0);
  61  |   const cart = page.getByRole("button", { name: "Warenkorb (0)", exact: true });
  62  |   await cart.click();
  63  |   await expect(page.getByRole("dialog")).toContainText("Aktuell sind keine Bestellungen möglich.");
  64  |   await page.keyboard.press("Escape");
  65  |   await expect(page.getByRole("dialog")).toBeHidden();
  66  |   await expect(cart).toBeFocused();
  67  |   await page.getByRole("link", { name: "Jetzt entdecken" }).click();
  68  |   await expect(page).toHaveURL(/#modelle$/);
  69  | });
  70  | 
  71  | test("both models and measurement draft open accessible dialogs", async ({ page }) => {
  72  |   await ready(page);
  73  |   for (const model of ["BASE I", "BASE II"]) {
  74  |     const trigger = page.getByRole("button", { name: `${model} entdecken`, exact: true });
  75  |     await trigger.click();
  76  |     const dialog = page.getByRole("dialog");
  77  |     await expect(dialog.getByRole("heading", { name: model, exact: true })).toBeVisible();
  78  |     await expect(dialog).toContainText("Der Online-Shop ist in Vorbereitung.");
  79  |     await page.keyboard.press("Escape");
  80  |     await expect(trigger).toBeFocused();
  81  |   }
  82  |   await page.getByRole("button", { name: "Hosenlänge messen" }).click();
  83  |   const dialog = page.getByRole("dialog");
  84  |   await expect(dialog).toContainText("SIZING · ENTWURF");
  85  |   await expect(dialog).toContainText("keine verbindliche Bestellanleitung");
  86  |   await dialog.getByRole("button", { name: "Verstanden" }).click();
  87  |   await expect(dialog).toBeHidden();
  88  | });
  89  | 
  90  | test("forward / reverse scroll, restored position and breakpoint cleanup", async ({ page }, testInfo) => {
  91  |   const errors: string[] = [];
  92  |   page.on("pageerror", (error) => errors.push(error.message));
  93  |   page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  94  |   await ready(page);
  95  |   const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  96  |   for (const fraction of [0, 0.2, 0.45, 0.7, 1, 0.7, 0.45, 0.2, 0]) {
  97  |     await jump(page, max * fraction);
  98  |     await noOverflow(page);
  99  |     expect(await page.locator(".story-sprite").evaluateAll((sprites) => sprites.every((sprite) => !sprite.getAttribute("style")?.includes("NaN")))).toBe(true);
  100 |   }
  101 |   await jump(page, max * 0.55);
  102 |   await page.reload();
  103 |   await expect(page.locator(".product-story")).toHaveAttribute("data-motion", /desktop|mobile/);
  104 |   await page.waitForTimeout(600);
  105 |   expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  106 |   await page.screenshot({ path: `artifacts/screenshots/${testInfo.project.name}-motion.png` });
  107 |   await page.setViewportSize({ width: 390, height: 844 });
```