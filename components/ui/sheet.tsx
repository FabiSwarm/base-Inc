"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetTitle = SheetPrimitive.Title;
export const SheetDescription = SheetPrimitive.Description;

export function SheetContent({ side = "left", className, children, ...props }:
  React.ComponentProps<typeof SheetPrimitive.Content> & { side?: "left" | "right" }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="modal-overlay" />
      <SheetPrimitive.Content data-slot="sheet-content" data-side={side} className={cn("sheet-content", className)} {...props}>
        {children}
        <SheetPrimitive.Close asChild>
          <Button variant="icon" className="modal-close" aria-label="Schließen"><X size={21} strokeWidth={1.5} /></Button>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}
