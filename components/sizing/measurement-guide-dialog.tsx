"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function MeasurementGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Hosenlänge messen</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <p className="eyebrow">SIZING · ENTWURF</p>
          <DialogTitle>Deine passende Länge.</DialogTitle>
          <DialogDescription>Die Messanleitung wird noch abgestimmt.</DialogDescription>
        </DialogHeader>
        <p>Hier findest du künftig die freigegebene Anleitung, mit der du deine Hosenlänge für BASE bestimmst.</p>
        <p className="muted">Messpunkte, Messmethode und die Übermittlung deines Maßes stehen noch nicht fest. Dieser Entwurf ist keine verbindliche Bestellanleitung.</p>
        <DialogClose asChild><Button variant="outline">Verstanden</Button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
