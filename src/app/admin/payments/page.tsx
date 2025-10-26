// src/app/(admin)/payments/page.tsx
import { redirect } from "next/navigation";

export default function PaymentsPage() {
  redirect("/admin/payments/list");
}