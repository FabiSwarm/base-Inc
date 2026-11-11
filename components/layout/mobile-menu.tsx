"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navigation } from "@/lib/content";

export function MobileMenu() {
  const destination = useRef<string | null>(null);
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="icon" className="header-control menu-trigger">Menü</Button></SheetTrigger>
      <SheetContent onCloseAutoFocus={(event) => {
        if (!destination.current) return;
        event.preventDefault();
        document.querySelector<HTMLElement>(destination.current)?.focus({ preventScroll: true });
        destination.current = null;
      }}>
        <SheetTitle className="sheet-wordmark">ASSISE</SheetTitle>
        <SheetDescription className="sr-only">Entdecke die ASSISE Anzugshose und finde deine Länge.</SheetDescription>
        <nav aria-label="Hauptnavigation" className="menu-links">
          {navigation.map(({ href, label }) => (
            <SheetClose asChild key={href}>
              <a href={href} onClick={() => { destination.current = href; }}>{label}</a>
            </SheetClose>
          ))}
        </nav>
        <p className="sheet-note">Die Essenz von Stil.</p>
      </SheetContent>
    </Sheet>
  );
}
