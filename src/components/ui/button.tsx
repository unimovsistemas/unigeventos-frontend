import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
      {...props}
    />
  );
}