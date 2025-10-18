"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";

export default function OrganizersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to list page with a smooth transition
    router.replace("/organizers/list");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text="Redirecionando..." />
    </div>
  );
}