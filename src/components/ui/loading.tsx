import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loading({ size = "md", text, className }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        <Loader2 className={cn("animate-spin text-orange-400", sizeClasses[size])} />
        <div className={cn("absolute inset-0 animate-ping opacity-20", sizeClasses[size])}>
          <div className="w-full h-full bg-orange-400 rounded-full" />
        </div>
      </div>
      {text && (
        <p className={cn("text-neutral-400 animate-pulse", textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Loading size="lg" text="Carregando..." />
    </div>
  );
}

export function CardLoading({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 rounded-lg animate-pulse"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="h-6 bg-neutral-600 rounded w-3/4"></div>
            <div className="h-8 w-8 bg-neutral-600 rounded-full"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-neutral-600 rounded w-full"></div>
            <div className="h-4 bg-neutral-600 rounded w-2/3"></div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 bg-neutral-600 rounded"></div>
              <div className="h-4 bg-neutral-600 rounded flex-1"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 bg-neutral-600 rounded"></div>
              <div className="h-4 bg-neutral-600 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-10 bg-neutral-600 rounded"></div>
        </div>
      ))}
    </div>
  );
}