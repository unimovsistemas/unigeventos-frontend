import { Controller } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface CustomDateTimePickerProps {
  name: string
  control: any
  label?: string
  placeholder?: string
}

export function CustomDateTimePicker({
  name,
  control,
  label,
  placeholder = "Selecione a data e hora"
}: CustomDateTimePickerProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <DatePicker
          id={name}
          placeholderText={placeholder}
          showTimeSelect
          dateFormat="dd/MM/yyyy HH:mm"
          timeFormat="HH:mm"
          timeIntervals={15}
          className="flex h-10 w-full rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-400 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:ring-offset-2 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
          selected={field.value}
          onChange={(date) => field.onChange(date)}
          wrapperClassName="w-full"
        />
      )}
    />
  )
}