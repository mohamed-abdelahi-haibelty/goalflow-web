"use client";

import { CreditCard, Zap } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { UpgradeModal } from "@/app/[locale]/(features)/billing/ui/UpgradeModal";

interface NavUpgradeProps {
  user: {
    id: string;
    email: string;
    isPro: boolean;
  };
}

export function NavUpgrade({ user }: NavUpgradeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarMenu>
          {/* Manage Billing - Standard Sidebar Style */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-muted-foreground">
              <Link href="/billing">
                <CreditCard className="w-4 h-4" />
                <span>Manage Billing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {!user.isPro && (
            <SidebarMenuItem className=" border border-dashed rounded-lg">
              <SidebarMenuButton onClick={() => setIsModalOpen(true)}>
                <Zap className="w-4 h-4" />
                <span className="">Go Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      <UpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user.id}
        userEmail={user.email}
      />
    </>
  );
}
