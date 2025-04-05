"use client";

import { useState } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
        isChecked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
          isChecked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
