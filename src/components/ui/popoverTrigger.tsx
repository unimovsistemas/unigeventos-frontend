import { ReactNode } from "react";
import { usePopover } from "./popover";

interface PopoverTriggerProps {
  children: ReactNode;
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { toggle } = usePopover();

  return (
    <button onClick={toggle} className="focus:outline-none">
      {children}
    </button>
  );
}
