import { ReactNode } from "react";
import { usePopover } from "./popover";

interface PopoverContentProps {
  children: ReactNode;
  className?: string;
}

export function PopoverContent({ children, className }: PopoverContentProps) {
  const { open } = usePopover();

  return open ? (
    <div className={`absolute mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-300 z-10 ${className}`}>
      {children}
    </div>
  ) : null;
}
