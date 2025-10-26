import { redirect } from "next/navigation";

export default function PersonsPage() {
  redirect(`/admin/persons/list`);
}
