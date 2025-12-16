import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDirection } from "@/lib/utils";

export default async function FeaturesLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const direction = getDirection(locale);
  const side = direction === "ltr" ? "left" : "right";
  return (
    <SidebarProvider>
      <AppSidebar side={side} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
