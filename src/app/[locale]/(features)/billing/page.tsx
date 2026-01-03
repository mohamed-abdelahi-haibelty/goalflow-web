import db from "@/lib/db";

import { redirect } from "next/navigation";
import { BillingClient } from "./ui/BillingClient";
import { getUserSession } from "@/actions/auth/getUserSession";
import { hasProAccess } from "@/lib/plan-utils";

export default async function BillingPage() {
  const session = await getUserSession();
  const user = await db.user.findUnique({
    where: { id: session?.user.id },
  });

  if (!user) redirect("/auth");

  const isPro = hasProAccess(user);
  // Fetch full subscription details
  const subscription = await db.subscription.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="container px-8">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your billing and plan preferences.
        </p>
      </div>

      <BillingClient subscription={subscription} user={user} isPro={isPro} />
    </div>
  );
}
