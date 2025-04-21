/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/select.tsx
import React, { createContext, useContext, useState } from "react";

// ========== SELECT ORIGINAL ==========
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

export const Select: React.FC<SelectProps> = ({ options, value, defaultValue, onChange, placeholder, className }) => {
  const isPlaceholderSelected = !value;

  return (
    <select
      value={value ?? defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className={`border rounded-lg p-2 w-full focus:ring focus:ring-orange-400 
        ${isPlaceholderSelected ? "text-gray-400" : "text-orange-600"} ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-orange-600">
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;

// ========== SUBCOMPONENTES OPCIONAIS ==========
interface SelectContextType {
  selected: string;
  setSelected: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Select components must be used inside <SelectRoot>");
  return context;
}

export const SelectRoot = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ selected, setSelected, isOpen, setIsOpen }}>
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ placeholder }: { placeholder?: string }) => {
  const { selected, setIsOpen } = useSelectContext();

  return (
    <button
      onClick={() => setIsOpen((prev) => !prev)}
      className="w-full border rounded-lg p-2 text-left text-orange-600 bg-white focus:ring focus:ring-orange-400"
    >
      {selected || <span className="text-gray-400">{placeholder ?? "Selecione"}</span>}
    </button>
  );
};

export const SelectContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSelectContext();

  if (!isOpen) return null;

  return (
    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
      {children}
    </ul>
  );
};

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const { setSelected, setIsOpen } = useSelectContext();

  const handleSelect = () => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <li
      onClick={handleSelect}
      className="px-4 py-2 cursor-pointer hover:bg-orange-100 text-orange-600"
    >
      {children}
    </li>
  );
};

export const SelectValue = () => {
  const { selected } = useSelectContext();
  return <span>{selected}</span>;
};
