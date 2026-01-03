"use server";

import db from "@/lib/db";
import { getUserSession } from "@/actions/auth/getUserSession";
import { paddle } from "@/lib/paddle";
import { revalidatePath } from "next/cache";

/**
 * Cancels a user's subscription at the end of the current billing period.
 */
export async function cancelSubscription(paddleSubscriptionId: string) {
  const session = await getUserSession();
  if (!session) return { success: false, message: "Unauthorized" };

  try {
    // 1. Verify the subscription belongs to the current user
    const subscription = await db.subscription.findUnique({
      where: {
        paddleSubscriptionId: paddleSubscriptionId,
        userId: session.user.id, // Ensure ownership
      },
    });

    if (!subscription) {
      return { success: false, message: "Subscription not found" };
    }

    // 2. Request cancellation from Paddle
    // 'next_billing_period' keeps features active until the paid time runs out
    await paddle.subscriptions.cancel(paddleSubscriptionId, {
      effectiveFrom: "next_billing_period",
    });

    // 3. Update local database state immediately for better UI feedback
    // The webhook will also confirm this later
    await db.subscription.update({
      where: { paddleSubscriptionId: paddleSubscriptionId },
      data: { cancelAtPeriodEnd: true },
    });

    revalidatePath("/billing", "page");
    return { success: true, message: "Subscription cancellation scheduled" };
  } catch (error) {
    console.error("Cancellation Error:", error);
    return { success: false, message: "Failed to cancel subscription" };
  }
}
