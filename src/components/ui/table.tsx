// components/ui/table.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ children, className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={cn(
          "w-full caption-bottom text-sm border-collapse border border-neutral-800 rounded-md",
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-black text-white">
    <tr>{children}</tr>
  </thead>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="bg-white dark:bg-neutral-950">{children}</tbody>
);

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900">
    {children}
  </tr>
);

export const TableHead = ({ children, className }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "text-left px-4 py-3 font-medium text-sm border-r border-neutral-800 last:border-r-0",
      className
    )}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn(
      "px-4 py-2 text-sm text-neutral-800 dark:text-neutral-200 border-r border-neutral-800 last:border-r-0",
      className
    )}
  >
    {children}
  </td>
);
