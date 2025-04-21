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
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-gray-700 font-medium">
          {label}
        </label>
      )}

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
              wrapperClassName="w-full" // <- força largura no wrapper
              className="border border-gray-300 text-orange-600 rounded-lg px-3 py-2 w-full"
            />
        )}
      />
    </div>
  )
}
