import { Controller } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface CustomDatePickerProps {
  name: string
  control: any
  label?: string
  placeholder?: string
  withTime?: boolean
}

export function CustomDatePicker({
  name,
  control,
  label,
  placeholder = "Selecione a data",
  withTime = false
}: CustomDatePickerProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <DatePicker
          id={name}
          placeholderText={placeholder}
          selected={field.value}
          onChange={field.onChange}
          showTimeSelect={withTime}
          dateFormat={withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
          timeFormat="HH:mm"
          timeIntervals={15}
          wrapperClassName="w-full"
          className="flex h-10 w-full rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-400 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:ring-offset-2 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
        />
      )}
    />
  )
}
