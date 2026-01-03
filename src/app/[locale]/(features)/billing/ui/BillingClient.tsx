"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Subscription, User } from "@/generated/prisma/client";
import { usePaddle } from "@/app/[locale]/(features)/paddle/hook/usePaddle";

import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, CreditCard, Infinity } from "lucide-react";
import { useState, useTransition } from "react";
import { cancelSubscription } from "../action/cancelSubscription";
import { getUpdatePaymentTransaction } from "../action/getUpdatePaymentTransaction";

const PADDLE_PRICE_IDS = {
  monthly: "pri_01kdamf396e6w5v9p5swwk8x6j",
  yearly: "pri_01kdd4mew19ee7zq19zp4g1a57",
};

interface Props {
  subscription: Subscription | null;
  user: User;
  isPro: boolean;
}

export function BillingClient({ subscription, user, isPro }: Props) {
  const { paddle } = usePaddle();
  const [isPending, startTransition] = useTransition();
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const isLifetime = isPro && !subscription;

  const isCanceled = subscription?.cancelAtPeriodEnd;

  // Handle Upgrade / Update Plan
  const handleUpdate = (priceId: string) => {
    if (!paddle) return;

    if (!subscription) {
      // New Checkout
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: { email: user.email },
        customData: { userId: user.id },
        settings: {
          allowLogout: false,
        },
      });
    } else {
      // Plan Switch (Proration)
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: {
          allowLogout: false,
          successUrl: `${window.location.origin}/project`,
        },
      });
    }
  };

  // Handle Update Payment Method
  const handleUpdatePaymentMethod = async () => {
    if (!subscription || !paddle) return;

    setIsUpdatingPayment(true);

    try {
      // 1. Get the transaction ID from server
      const res = await getUpdatePaymentTransaction(
        subscription.paddleSubscriptionId
      );

      if (res.success && res.transactionId) {
        // 2. Open Paddle Checkout in "Update" mode
        paddle.Checkout.open({
          transactionId: res.transactionId,
        });
      } else {
        toast.error("Could not initiate payment update.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setIsUpdatingPayment(false);
    }
  };
  const handleCancel = () => {
    if (!subscription) return;

    startTransition(async () => {
      const res = await cancelSubscription(subscription.paddleSubscriptionId);
      if (res.success) {
        toast.success("Subscription scheduled to cancel at end of period.");
      } else {
        toast.error("Failed to cancel.");
      }
    });
  };

  if (isLifetime) {
    return (
      <Card className="border-dashed shadow-none mx-auto max-w-2xl  dark:border-primary/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                Lifetime Access
                <Badge
                  variant="secondary"
                  className="bg-primary text-primary-foreground"
                >
                  Special
                </Badge>
              </CardTitle>
              <CardDescription>
                You have full access to all features. No further billing
                required.
              </CardDescription>
            </div>
            <Infinity className="size-8  opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your account has been granted permanent Pro status. You will not be
            charged, and your access will never expire.
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground italic">
          Managed by administrator
        </CardFooter>
      </Card>
    );
  }

  if (!isPro) {
    return (
      <Card className="border-dashed border-2 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Free Plan</CardTitle>
          <CardDescription>You are currently on the free plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Upgrade to Pro to unlock unlimited projects and analytics.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleUpdate(PADDLE_PRICE_IDS.yearly)}>
            Upgrade to Pro
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-dashed shadow-none mx-auto max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Pro Plan
              <Badge variant={isCanceled ? "destructive" : "default"}>
                {isCanceled ? "Canceling" : "Active"}
              </Badge>
            </CardTitle>
            <CardDescription>
              {isCanceled
                ? `Access until ${format(
                    new Date(subscription.currentPeriodEnd),
                    "PPP"
                  )}`
                : `Next billing date: ${format(
                    new Date(subscription?.currentPeriodEnd!),
                    "PPP"
                  )}`}
            </CardDescription>
          </div>
          {/* Show Plan Type identifier if available in your DB, otherwise infer from priceId */}
          <div className="text-xl font-bold">
            {subscription?.paddlePriceId === PADDLE_PRICE_IDS.yearly
              ? "$11.99/yr"
              : "$1.99/mo"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 ">
        <div className="rounded-lg border p-4 flex items-center gap-4">
          <CreditCard className="text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Payment Method</p>
            <p className="text-xs text-muted-foreground">
              Managed securely via Paddle
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdatePaymentMethod}
            disabled={isUpdatingPayment}
          >
            {isUpdatingPayment ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Update Payment"
            )}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t">
        {/* Switch Plans Logic */}
        <div className="flex gap-2">
          {subscription?.paddlePriceId === PADDLE_PRICE_IDS.monthly &&
            !isCanceled && (
              <Button
                variant="secondary"
                onClick={() => handleUpdate(PADDLE_PRICE_IDS.yearly)}
              >
                Switch to Yearly (Save 66%)
              </Button>
            )}
        </div>

        {/* Cancel Logic */}
        {!isCanceled && (
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleCancel}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel Subscription
          </Button>
        )}

        {isCanceled && (
          <Button disabled variant="secondary">
            Canceled
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
