import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function ready(page: Page) {
  await page.goto("/");
  await page.locator(".page-content").waitFor();
  await expect(page.locator(".page-content")).toHaveAttribute("data-motion", /fade|reduced/);
  await page.evaluate(() => document.fonts.ready);
}

async function jump(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(950); // Wait for the opacity reveal and its short text stagger.
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test("static reference layout, imagery, centering and responsive order", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await expect(page.locator("main section")).toHaveCount(4);
  await expect(page.locator("h1")).toHaveText("Die Essenz von Stil.");
  await expect(page.locator(".story-sprite, .story-overlay, .pin-spacer")).toHaveCount(0);
  const shadows = await page.locator(".hero-frame").evaluate((element) =>
    ["::before", "::after"].map((pseudo) => {
      const style = getComputedStyle(element, pseudo);
      return { content: style.content, width: parseFloat(style.width), height: parseFloat(style.height), center: parseFloat(style.left), background: style.backgroundColor };
    })
  );
  for (const shadow of shadows) {
    expect(shadow.content).toBe('""');
    expect(shadow.width).toBeGreaterThan(0);
    expect(shadow.height).toBeGreaterThan(0);
    expect(shadow.background).not.toBe("rgba(0, 0, 0, 0)");
  }
  expect(shadows[0].center + shadows[0].width / 2).toBeLessThan(shadows[1].center - shadows[1].width / 2);
  const footer = page.getByRole("contentinfo");
  for (const [name, href] of [["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"], ["AGB", "/agb"], ["Widerruf", "/widerruf"]]) {
    await expect(footer.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
  }
  await expect(footer.getByRole("navigation", { name: "ENTDECKEN" }).getByRole("link")).toHaveCount(4);
  const logo = await page.locator(".wordmark").boundingBox();
  const header = await page.locator(".site-header").boundingBox();
  expect(Math.abs(logo!.x + logo!.width / 2 - (header!.x + header!.width / 2))).toBeLessThan(1);
  const left = await page.locator('[data-product="left"]').boundingBox();
  const right = await page.locator('[data-product="right"]').boundingBox();
  if (testInfo.project.use.viewport!.width < 768) {
    expect(right!.y).toBeGreaterThan(left!.y + left!.height);
    expect(Math.abs(left!.x - right!.x)).toBeLessThan(1);
  } else {
    expect(Math.abs(left!.y - right!.y)).toBeLessThan(1);
    expect(right!.x).toBeGreaterThan(left!.x + left!.width);
  }
  const images = page.locator("[data-product] img");
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await image.evaluate((img) => getComputedStyle(img).objectFit)).toBe("contain");
    expect(await image.evaluate((img) => getComputedStyle(img).filter)).toBe("none");
  }
  await footer.scrollIntoViewIfNeeded();
  await noOverflow(page);
  await jump(page, 0);
  await page.screenshot({ path: `artifacts/screenshots/${testInfo.project.name}-static.png`, fullPage: true });
});

test("fixed header changes background on scroll and leaves anchor headings visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  const header = page.getByRole("banner");
  await expect(header).toHaveCSS("position", "fixed");
  const headerBounds = (await header.boundingBox())!;
  const logoBounds = (await header.locator(".wordmark").boundingBox())!;
  const aboveLogo = logoBounds.y - headerBounds.y;
  const belowLogo = headerBounds.y + headerBounds.height - logoBounds.y - logoBounds.height;
  expect(Math.abs(aboveLogo - belowLogo)).toBeLessThan(1);
  const initialColor = await header.evaluate((element) => getComputedStyle(element).backgroundColor);

  await jump(page, 400);
  expect((await header.boundingBox())!.y).toBe(0);
  await expect.poll(() => header.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(initialColor);

  await jump(page, 0);
  await expect(header).toHaveCSS("background-color", initialColor);
  await page.getByRole("link", { name: "Jetzt entdecken", exact: true }).click();
  const heading = page.getByRole("heading", { name: "Zwei Schnitte. Eine Haltung.", exact: true });
  await expect(heading).toBeInViewport();
  await expect.poll(async () => {
    const headerBounds = (await header.boundingBox())!;
    return (await heading.boundingBox())!.y - headerBounds.y - headerBounds.height;
  }).toBeGreaterThanOrEqual(0);
});

test("navigation, native anchors, cart and focus restoration", async ({ page }) => {
  await ready(page);
  await page.getByRole("button", { name: "Menü", exact: true }).click();
  const sheet = page.getByRole("dialog");
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("navigation").getByRole("link")).toHaveCount(4);
  await sheet.getByRole("link", { name: "Deine Länge" }).click();
  await expect(sheet).toBeHidden();
  await expect(page).toHaveURL(/#sizing$/);
  await expect(page.locator("#sizing")).toBeFocused();
  await jump(page, 0);
  const cart = page.getByRole("button", { name: "Warenkorb (0)", exact: true });
  await cart.click();
  await expect(page.getByRole("dialog")).toContainText("Aktuell sind keine Bestellungen möglich.");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(cart).toBeFocused();
  await page.getByRole("link", { name: "Jetzt entdecken" }).click();
  await expect(page).toHaveURL(/#modelle$/);
});

test("both models and measurement draft open accessible dialogs", async ({ page }) => {
  await ready(page);
  for (const model of ["ASSISE I", "ASSISE II"]) {
    const trigger = page.getByRole("button", { name: `${model} entdecken`, exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: model, exact: true })).toBeVisible();
    await expect(dialog).toContainText("Der Online-Shop ist in Vorbereitung.");
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  }
  await page.getByRole("button", { name: "Hosenlänge messen" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("SIZING · ENTWURF");
  await expect(dialog).toContainText("keine verbindliche Bestellanleitung");
  await dialog.getByRole("button", { name: "Verstanden" }).click();
  await expect(dialog).toBeHidden();
});

test("fade-ins preserve product geometry, restored position and reduced motion", async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await ready(page);
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (const fraction of [0, 0.2, 0.45, 0.7, 1, 0.7, 0.45, 0.2, 0]) {
    await jump(page, max * fraction);
    await noOverflow(page);
    for (const product of await page.locator("[data-product]").all()) {
      await expect(product).toHaveCSS("transform", "none");
      const bounds = await product.boundingBox();
      if (bounds && bounds.y >= 0 && bounds.y < page.viewportSize()!.height - 28) {
        await expect(product).toHaveCSS("opacity", "1");
      }
    }
  }
  await jump(page, max * 0.55);
  await page.reload();
  await expect(page.locator(".page-content")).toHaveAttribute("data-motion", /fade/);
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.screenshot({ path: `artifacts/screenshots/${testInfo.project.name}-motion.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".page-content")).toHaveAttribute("data-motion", "fade");
  await expect(page.locator(".story-sprite")).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(".page-content")).toHaveAttribute("data-motion", "fade");
  await expect(page.locator(".story-sprite, .story-overlay")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".page-content")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator(".story-sprite")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  for (const product of await page.locator("[data-product]").all()) {
    await expect(product).toHaveCSS("opacity", "1");
    await expect(product).toHaveCSS("transform", "none");
  }
  await noOverflow(page);
  expect(errors).toEqual([]);
});

test("deep links keep the destination visible", async ({ page }) => {
  await page.goto("/#sizing");
  await expect(page.locator(".page-content")).toHaveAttribute("data-motion", /fade/);
  await expect(page.getByRole("heading", { name: "Eine Größe. Deine Länge." })).toBeInViewport();
  await page.getByRole("button", { name: "Hosenlänge messen" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("static content survives disabled JavaScript", async ({ browser, baseURL }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator("main section")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Die Essenz von Stil." })).toBeVisible();
  await expect(page.locator("[data-product]")).toHaveCount(5);
  for (const product of await page.locator("[data-product]").all()) await expect(product).toHaveCSS("opacity", "1");
  await page.getByRole("link", { name: "Jetzt entdecken" }).click();
  await expect(page).toHaveURL(/#modelle$/);
  await noOverflow(page);
  await context.close();
});

test("page and measurement dialog have no automated accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Hosenlänge messen" }).click();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});
