import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função para combinar classes do Tailwind de forma eficiente
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
