import { MobileMenu } from "@/components/layout/mobile-menu";
import { CartSheet } from "@/components/layout/cart-sheet";

export function SiteHeader() {
  return (
    <header className="site-header">
      <MobileMenu />
      <a className="wordmark" href="#hero" aria-label="BASE — Startseite">BASE</a>
      <CartSheet />
    </header>
  );
}
