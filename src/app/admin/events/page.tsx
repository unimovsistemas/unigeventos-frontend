// src/app/(admin)/organizers/page.tsx
import { redirect } from "next/navigation";

export default function EventsPage() {
  redirect("/admin/events/list");
}