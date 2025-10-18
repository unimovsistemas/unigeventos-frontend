// src/components/ui/avatar.tsx
"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils"; // função opcional para juntar classes
import { User } from "lucide-react"; // ícone de usuário

export function Avatar({
  src,
  alt,
  fallbackText,
  className,
}: {
  src?: string;
  alt?: string;
  fallbackText?: string;
  className?: string;
}) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full bg-neutral-800 align-middle",
        className
      )}
    >
      <AvatarPrimitive.Image
        className="h-full w-full object-cover"
        src={src}
        alt={alt}
      />
      <AvatarPrimitive.Fallback
        delayMs={600}
        className="flex h-full w-full items-center justify-center text-sm font-medium text-white bg-neutral-700"
      >
        {fallbackText ? (
          fallbackText.slice(0, 2).toUpperCase()
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
