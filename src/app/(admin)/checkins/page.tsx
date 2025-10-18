// app/(admin)/checkins/page.tsx
import { redirect } from "next/navigation";

export default function CheckinsRedirectPage() {
  redirect("/checkins/list");
}
