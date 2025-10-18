import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={cn(
      "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: number | string;
}

export function ResponsiveGrid({ 
  children, 
  className, 
  cols = { default: 1, sm: 2, lg: 2, xl: 3, "2xl": 4 },
  gap = 4 
}: ResponsiveGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2", 
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  const smCols = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3", 
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
  };

  const mdCols = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4", 
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  };

  const lgCols = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5", 
    6: "lg:grid-cols-6",
  };

  const xlCols = {
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2", 
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    5: "xl:grid-cols-5",
    6: "xl:grid-cols-6",
  };

  const twoxlCols = {
    1: "2xl:grid-cols-1",
    2: "2xl:grid-cols-2",
    3: "2xl:grid-cols-3", 
    4: "2xl:grid-cols-4",
    5: "2xl:grid-cols-5",
    6: "2xl:grid-cols-6",
  };

  const gapClass = typeof gap === 'number' ? `gap-${gap}` : gap;

  return (
    <div className={cn(
      "grid",
      cols.default && gridCols[cols.default as keyof typeof gridCols],
      cols.sm && smCols[cols.sm as keyof typeof smCols], 
      cols.md && mdCols[cols.md as keyof typeof mdCols],
      cols.lg && lgCols[cols.lg as keyof typeof lgCols],
      cols.xl && xlCols[cols.xl as keyof typeof xlCols],
      cols["2xl"] && twoxlCols[cols["2xl"] as keyof typeof twoxlCols],
      gapClass,
      className
    )}>
      {children}
    </div>
  );
}