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
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-gray-700">
        {label}
      </label>

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
            className="border border-gray-300 text-orange-600 rounded-lg px-3 py-2 w-full"
            selected={field.value}
            onChange={(date) => field.onChange(date)}
          />
        )}
      />
    </div>
  )
}