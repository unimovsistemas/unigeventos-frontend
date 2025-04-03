import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, defaultValue, onChange, placeholder, className }) => {
  const isPlaceholderSelected = !value; // Verifica se o valor selecionado é o placeholder

  return (
    <select
      value={value ?? defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className={`border rounded-lg p-2 w-full focus:ring focus:ring-orange-400 
        ${isPlaceholderSelected ? "text-gray-400" : "text-black"} ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-black">
          {option.label}
        </option>
      ))}
    </select>
  );
};


export default Select;