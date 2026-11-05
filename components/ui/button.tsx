import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva("base-button", {
  variants: {
    variant: {
      primary: "base-button--primary",
      outline: "base-button--outline",
      text: "base-button--text",
      icon: "base-button--icon",
    },
  },
  defaultVariants: { variant: "primary" },
});

export function Button({ className, variant, asChild = false, ...props }:
  React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "button";
  return <Component data-slot="button" className={cn(buttonVariants({ variant }), className)} {...props} />;
}
