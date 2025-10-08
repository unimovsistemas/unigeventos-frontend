import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover } from "@/components/ui/popover";
import { PopoverTrigger } from "@/components/ui/popoverTrigger";
import { PopoverContent } from "@/components/ui/popoverContent";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="border border-gray-300 rounded-lg px-3 py-2 w-full text-left bg-white cursor-pointer">
          {value ? format(value, "dd/MM/yyyy") : "Selecione uma data"}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <Calendar mode="single" selected={value} onSelect={(date) => onChange(date ?? new Date())} />
      </PopoverContent>
    </Popover>
  );
}

