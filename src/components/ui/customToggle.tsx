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
    <div className={cn("flex items-center justify-between w-full gap-4 p-3 rounded-lg bg-neutral-800/50 border border-neutral-600", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium text-neutral-200 cursor-pointer",
          disabled && "opacity-50"
        )}
      >
        {label}
      </Label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-2 focus:ring-offset-neutral-800",
          disabled
            ? "bg-neutral-600 cursor-not-allowed"
            : checked
            ? "bg-gradient-to-r from-orange-600 to-orange-700"
            : "bg-neutral-600"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-200",
            checked ? "translate-x-6 shadow-orange-600/25" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}