"use client";

import { useEffect, useRef } from "react";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { CartSheet } from "@/components/layout/cart-sheet";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateBackground = () => {
      header.dataset.scrolled = String(window.scrollY > 0);
    };

    updateBackground();
    window.addEventListener("scroll", updateBackground, { passive: true });
    window.addEventListener("pageshow", updateBackground);
    return () => {
      window.removeEventListener("scroll", updateBackground);
      window.removeEventListener("pageshow", updateBackground);
    };
  }, []);

  return (
    <header ref={headerRef} className="site-header" data-scrolled="false">
      <MobileMenu />
      <a className="wordmark" href="#hero" aria-label="ASSISE — Startseite">ASSISE</a>
      <CartSheet />
    </header>
  );
}
