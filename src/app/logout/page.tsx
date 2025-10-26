"use client";

import { useEffect } from "react";
import { useLogout } from "@/hooks/useLogout";

export default function LogoutPage() {
  const { performLogout } = useLogout();

  useEffect(() => {
    performLogout();
  }, [performLogout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-neutral-200">Fazendo logout...</p>
      </div>
    </div>
  );
}