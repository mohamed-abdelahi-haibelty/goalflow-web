import {
  handleDowngrade,
  handleUpgrade,
} from "@/app/[locale]/(features)/paddle/action/subscription";
import { SubscriptionStatus } from "@/generated/prisma/client";
import db from "@/lib/db";
import { paddle } from "@/lib/paddle";
import {
  EventName,
  SubscriptionNotification,
  TransactionNotification,
} from "@paddle/paddle-node-sdk";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("paddle-signature") || "";
  const rawRequestBody = await request.text();
  const privateKey = process.env.WEBHOOK_SECRET_KEY || "";

  try {
    if (!signature || !rawRequestBody) {
      return NextResponse.json(
        { error: "Missing signature from header" },
        { status: 400 }
      );
    }

    // 1. Verify Signature
    const eventData = await paddle.webhooks.unmarshal(
      rawRequestBody,
      privateKey,
      signature
    );
    const eventType = eventData?.eventType ?? "Unknown event";

    if (eventData) {
      switch (eventType) {
        // ====================================================
        // 1. Subscription Lifecycle (Created, Updated, Activated)
        // ====================================================
        case EventName.SubscriptionCreated:
        case EventName.SubscriptionUpdated:
        case EventName.SubscriptionActivated:
          const subData = eventData.data as SubscriptionNotification;

          // Use customData.userId directly or fallback to DB lookup via customerId
          let userId = subData.customData?.userId;
          if (!userId && subData.customerId) {
            const user = await db.user.findUnique({
              where: { paddleCustomerId: subData.customerId },
            });
            userId = user?.id;
          }

          if (!userId) {
            console.error(`[Webhook] No User ID found for sub: ${subData.id}`);
            break;
          }

          // 1a. Sync Customer ID if missing
          await db.user.update({
            where: { id: userId },
            data: { paddleCustomerId: subData.customerId },
          });

          // 1b. Upsert Subscription
          // This handles the status change: PAST_DUE -> ACTIVE
          await db.subscription.upsert({
            where: { paddleSubscriptionId: subData.id },
            update: {
              status: subData.status.toUpperCase() as SubscriptionStatus,
              paddleProductId: subData?.items[0]?.product?.id || "",
              paddlePriceId: subData?.items[0]?.price?.id || "",
              currentPeriodStart: new Date(
                subData.currentBillingPeriod?.startsAt || Date.now()
              ),
              currentPeriodEnd: new Date(
                subData.currentBillingPeriod?.endsAt || Date.now()
              ),
              cancelAtPeriodEnd: subData.scheduledChange?.action === "cancel",
            },
            create: {
              paddleSubscriptionId: subData.id,
              paddlePriceId: subData?.items[0]?.price?.id || "",
              paddleProductId: subData?.items[0]?.product?.id || "",
              status: subData.status.toUpperCase() as SubscriptionStatus,
              currentPeriodStart: new Date(
                subData.currentBillingPeriod?.startsAt || Date.now()
              ),
              currentPeriodEnd: new Date(
                subData.currentBillingPeriod?.endsAt || Date.now()
              ),
              user: {
                connect: { id: userId },
              },
            },
          });

          // 1c. Handle Logic based on Status
          // If the user was PAST_DUE and just updated payment => Status becomes ACTIVE => Upgrade
          if (subData.status === "active") {
            await handleUpgrade(
              userId,
              subData.id,
              subData?.items[0]?.price?.id ?? ""
            );
          }
          // If payment failed explicitly or canceled
          else if (
            subData.status === "past_due" ||
            subData.status === "canceled"
          ) {
            await handleDowngrade(userId);
          }
          break;

        // ====================================================
        // 2. Handle Transaction Events (Receipts, Payments)
        // ====================================================
        case EventName.TransactionCompleted:
          const txnData = eventData.data as TransactionNotification;

          // "Update Payment Method" creates a $0 transaction.
          // We generally want to log it, but safeguard against missing items.

          let txnUserId = txnData.customData?.userId;
          if (!txnUserId && txnData.customerId) {
            const user = await db.user.findUnique({
              where: { paddleCustomerId: txnData.customerId },
            });
            txnUserId = user?.id;
          }

          if (txnUserId) {
            await db.transaction.upsert({
              where: { paddleTransactionId: txnData.id },
              create: {
                userId: txnUserId,
                paddleTransactionId: txnData.id,
                paddleSubscriptionId: txnData.subscriptionId || null,
                paddleProductId:
                  txnData.items?.[0]?.price?.productId || "maintenance", // Fallback for $0 auths
                amount: Math.round(
                  parseFloat(txnData.details?.totals?.grandTotal || "0") * 100
                ),
                currency: txnData.currencyCode,
                status: "COMPLETED",
                receiptUrl: `https://vendors-v2.paddle.com/transaction/${txnData.id}/invoice`,
                createdAt: new Date(txnData.createdAt),
              },
              update: {
                status: "COMPLETED",
                receiptUrl: `https://vendors-v2.paddle.com/transaction/${txnData.id}/invoice`,
              },
            });
          }
          break;

        // ====================================================
        // 3. Handle Cancellations & Past Due
        // ====================================================
        // Note: SubscriptionUpdated often fires before these, but these are good explicit catches
        case EventName.SubscriptionCanceled:
        case EventName.SubscriptionPastDue:
          const cancelData = eventData.data as SubscriptionNotification;

          // We only need to find and update because Upsert logic is in "Updated"
          const sub = await db.subscription.findUnique({
            where: { paddleSubscriptionId: cancelData.id },
          });

          if (sub) {
            await db.subscription.update({
              where: { paddleSubscriptionId: cancelData.id },
              data: {
                status: cancelData.status.toUpperCase() as SubscriptionStatus,
                cancelAtPeriodEnd: false,
              },
            });

            // Trigger Downgrade Logic
            await handleDowngrade(sub.userId);
          }
          break;
      }
    }

    revalidatePath("/project");

    return NextResponse.json({ status: 200 });
  } catch (e) {
    console.error("[Webhook Error]", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
