import { redirect } from "next/navigation";

export default function SubscriptionsPage() {
  redirect(`/admin/subscriptions/list`);
}
