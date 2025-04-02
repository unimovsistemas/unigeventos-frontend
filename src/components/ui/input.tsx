import { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="border border-gray-300 rounded-lg px-3 py-2 w-full"
      {...props}
    />
  );
}