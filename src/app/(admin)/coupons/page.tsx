// src/app/(admin)/coupons/page.tsx
import { redirect } from "next/navigation";

export default function CouponsPage() {
  redirect("/coupons/list");
}