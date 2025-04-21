// components/custom-toggle.tsx
"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CustomToggleProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function CustomToggle({
  label,
  id,
  checked,
  onChange,
  disabled = false,
  className,
}: CustomToggleProps) {
  return (
    <div className={cn("flex items-center justify-between w-full gap-4", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium",
          disabled ? "text-muted-foreground opacity-50" : "text-muted-foreground"
        )}
      >
        {label}
      </Label>
      <button
        id={id}
        type="button" // 👈 Adicionado aqui!
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none",
          disabled
            ? "bg-gray-200 cursor-not-allowed"
            : checked
            ? "bg-orange-500"
            : "bg-gray-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}