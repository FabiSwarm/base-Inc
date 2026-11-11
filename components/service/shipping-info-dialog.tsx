"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { content } from "@/lib/content";

export function ShippingInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="text">{content.service.shipping.cta}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <p className="eyebrow">ASSISE SERVICE</p>
          <DialogTitle>Versand & Rücksendung</DialogTitle>
          <DialogDescription>Alle Details zum Shopstart.</DialogDescription>
        </DialogHeader>
        <p>Die Informationen zu Liefergebieten, Versandkosten und Lieferzeiten veröffentlichen wir zum Start unseres Online-Shops.</p>
        <p className="muted">Dort findest du auch die Hinweise zur Rücksendung und zu individuell gekürzten Hosen.</p>
        <DialogClose asChild><Button variant="outline">Verstanden</Button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
