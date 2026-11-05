"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function CartSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="icon" className="header-control cart-trigger" aria-label="Warenkorb (0)">
          <span className="cart-desktop">Warenkorb (0)</span>
          <span className="cart-mobile" aria-hidden="true"><ShoppingBag size={23} strokeWidth={1.4} /><span>(0)</span></span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle className="modal-title">Dein Warenkorb (0)</SheetTitle>
        <div className="cart-empty">
          <ShoppingBag size={40} strokeWidth={1} aria-hidden="true" />
          <h3>Hier ist noch Platz.</h3>
          <SheetDescription>Dein Warenkorb ist leer. Der Online-Shop ist noch in Vorbereitung. Aktuell sind keine Bestellungen möglich.</SheetDescription>
          <SheetClose asChild><Button variant="outline">Weiter entdecken</Button></SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
