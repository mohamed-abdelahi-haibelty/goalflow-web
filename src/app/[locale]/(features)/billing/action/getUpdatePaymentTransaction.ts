"use server";

import { getUserSession } from "@/actions/auth/getUserSession";
import db from "@/lib/db";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

// Initialize Paddle Server-side SDK
const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment:
    process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
      ? Environment.production
      : Environment.sandbox,
});

export async function getUpdatePaymentTransaction(
  paddleSubscriptionId: string
) {
  try {
    // 1. Verify User Session
    const session = await getUserSession();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // 2. Verify Ownership (Security)
    // Ensure the subscription actually belongs to the requesting user
    const subscription = await db.subscription.findFirst({
      where: {
        paddleSubscriptionId: paddleSubscriptionId,
        userId: session.user.id,
      },
    });

    if (!subscription) {
      throw new Error("Subscription not found or unauthorized");
    }

    // 3. Call Paddle API to get a transaction specifically for updating payment details
    const transaction = await paddle.subscriptions.getPaymentMethodChangeTransaction(
      paddleSubscriptionId
    );

    return { success: true, transactionId: transaction.id };
  } catch (error) {
    console.error("Failed to generate update transaction:", error);
    return { success: false, error: "Failed to initialize payment update" };
  }
}
