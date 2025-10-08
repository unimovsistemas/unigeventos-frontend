import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"; // ou adapte para seu helper de classNames

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export { Label };