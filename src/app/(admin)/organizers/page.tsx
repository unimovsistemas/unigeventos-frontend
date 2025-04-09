// src/app/(admin)/organizers/page.tsx
import { redirect } from "next/navigation";

export default function OrganizersPage() {
  redirect("/organizers/list");
}