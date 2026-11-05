"use client";

import type { ProductModel } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ProductDetailsDialog({ model }: { model: ProductModel }) {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="text" aria-label={`${model.name} entdecken`}>Entdecken</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <p className="eyebrow">DIE BASE ANZUGSHOSE</p>
          <DialogTitle>{model.name}</DialogTitle>
          <DialogDescription>{model.fit}</DialogDescription>
        </DialogHeader>
        <p>{model.description}</p>
        <p className="muted">Eine Einheitsgröße. Von uns auf dein Maß gekürzt oder ungekürzt für die Anpassung vor Ort.</p>
        <p className="dialog-note">Der Online-Shop ist in Vorbereitung. Preise, Verfügbarkeit und Bestellung folgen.</p>
        <DialogClose asChild><Button variant="outline">Zurück zu den Modellen</Button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
