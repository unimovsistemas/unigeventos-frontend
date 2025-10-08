import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const typeConfig = {
  danger: {
    icon: XCircle,
    bgColor: "bg-red-600/10",
    iconColor: "text-red-400",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-600/10",
    iconColor: "text-yellow-400",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-600/10",
    iconColor: "text-blue-400",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-600/10",
    iconColor: "text-green-400",
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "info",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 shadow-2xl max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 bg-transparent hover:bg-neutral-700 text-neutral-400 hover:text-white"
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Content */}
        <div className="text-center">
          <div className={cn("p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center", config.bgColor)}>
            <Icon className={cn("h-8 w-8", config.iconColor)} />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">
            {title}
          </h2>
          
          <p className="text-neutral-400 mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 bg-transparent hover:bg-neutral-700 text-neutral-300 border border-neutral-600 hover:border-neutral-500"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn("px-6 py-2 text-white", config.buttonColor, {
                "opacity-50 cursor-not-allowed": isLoading
              })}
            >
              {isLoading ? "Processando..." : confirmText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}