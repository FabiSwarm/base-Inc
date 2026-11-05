import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function ready(page: Page) {
  await page.goto("/");
  await page.locator(".product-story").waitFor();
  await expect(page.locator(".product-story")).toHaveAttribute("data-motion", /desktop|mobile|reduced/);
  await page.evaluate(() => document.fonts.ready);
}

async function jump(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(450); // Allow the deliberately smoothed scrub to settle.
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test("static reference layout, imagery, centering and responsive order", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await expect(page.locator("main section")).toHaveCount(4);
  await expect(page.locator("h1")).toHaveText("Die Essenz von Stil.");
  await expect(page.locator(".story-sprite")).toHaveCount(0);
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
  await noOverflow(page);
  await jump(page, 0);
  await page.screenshot({ path: `artifacts/screenshots/${testInfo.project.name}-static.png`, fullPage: true });
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
  for (const model of ["BASE I", "BASE II"]) {
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

test("forward / reverse scroll, restored position and breakpoint cleanup", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await ready(page);
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (const fraction of [0, 0.2, 0.45, 0.7, 1, 0.7, 0.45, 0.2, 0]) {
    await jump(page, max * fraction);
    await noOverflow(page);
    expect(await page.locator(".story-sprite").evaluateAll((sprites) => sprites.every((sprite) => !sprite.getAttribute("style")?.includes("NaN")))).toBe(true);
  }
  await jump(page, max * 0.55);
  await page.reload();
  await expect(page.locator(".product-story")).toHaveAttribute("data-motion", /desktop|mobile/);
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.screenshot({ path: `artifacts/screenshots/${testInfo.project.name}-motion.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".product-story")).toHaveAttribute("data-motion", "mobile");
  await expect(page.locator(".story-sprite")).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(".product-story")).toHaveAttribute("data-motion", "desktop");
  await expect(page.locator(".story-sprite")).toHaveCount(4);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".product-story")).toHaveAttribute("data-motion", "reduced");
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
  await expect(page.locator(".product-story")).toHaveAttribute("data-motion", /desktop|mobile/);
  await expect(page.getByRole("heading", { name: "Eine Größe. Deine Länge." })).toBeInViewport();
  await page.getByRole("button", { name: "Hosenlänge messen" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("static content survives disabled JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000");
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
