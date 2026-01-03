"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react"; // Using Lucide icon for consistency
import { usePaddle } from "@/app/[locale]/(features)/paddle/hook/usePaddle";

// Reuse your IDs
const PADDLE_PRICE_IDS = {
  monthly: "pri_01kdamf396e6w5v9p5swwk8x6j",
  yearly: "pri_01kdd4mew19ee7zq19zp4g1a57",
};

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  userId,
  userEmail,
}: UpgradeModalProps) {
  const { paddle } = usePaddle();

  function handleCheckout(priceId: string) {
    if (!paddle) return;
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
      customData: { userId },
      settings: {
        variant: "one-page",
        displayMode: "overlay",
        theme: "dark",
        allowLogout: false,
        successUrl: `${window.location.origin}/project`,
      },
    });
    onClose();
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTitle />
        <DialogContent className="max-w-xl! bg-background/95 backdrop-blur-xl border-border p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Unlock Full Access
            </h2>
            <p className="text-muted-foreground mt-2">
              Remove limits and enable advanced features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Yearly Plan (Highlighted) */}
            <div className="relative p-6 rounded-2xl bg-card dark:bg-primary/5 border dark:border-primary/20 flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Best Value
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">Yearly Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black">$11.99</span>
                <span className="text-muted-foreground line-through text-sm">
                  $19.99
                </span>
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>

              <ul className="space-y-3 mb-6 flex-1 text-sm">
                <li className="flex gap-2 items-center">
                  <Check className="w-4 h-4 text-primary" />{" "}
                  <span>Everything in Monthly</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check className="w-4 h-4 text-primary" />{" "}
                  <span>Pay once per year — best value</span>
                </li>
              </ul>

              <Button
                onClick={() => handleCheckout(PADDLE_PRICE_IDS.yearly)}
                className="w-full"
              >
                Upgrade Yearly
              </Button>
            </div>

            {/* Monthly Plan */}
            <div className="p-6 rounded-2xl bg-card border border-border flex flex-col">
              <h3 className="text-xl font-semibold mb-1">Monthly</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$1.99</span>
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1 text-sm text-muted-foreground">
                <li className="flex gap-2 items-center">
                  <Check className="w-4 h-4" /> <span>Unlimited Projects</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check className="w-4 h-4" />{" "}
                  <span>Full Productivity Analytics</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Check className="w-4 h-4" />{" "}
                  <span>Yearly Activity Heatmap</span>
                </li>
              </ul>
              <Button
                variant="outline"
                onClick={() => handleCheckout(PADDLE_PRICE_IDS.monthly)}
                className="w-full"
              >
                Upgrade Monthly
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
