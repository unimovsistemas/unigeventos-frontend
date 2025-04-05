import { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="border border-gray-300 text-orange-600 rounded-lg px-3 py-2 w-full"
      {...props}
    />
  );
}