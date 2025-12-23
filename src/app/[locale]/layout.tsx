import type { Metadata } from "next";
import localFont from "next/font/local";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { getDirection } from "@/lib/utils";

const mabry = localFont({
  src: [
    {
      path: "../../../public/fonts/mabry/MabryPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/mabry/MabryPro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/mabry/MabryPro-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mabry", // optional CSS variable
});

export const metadata: Metadata = {
  title: "GoalFlow",
  description: "Manage Your Tasks",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return (
      <html lang={"en"}>
        <body className={`${mabry.variable} antialiased `}>Not found</body>
      </html>
    );
  }

  setRequestLocale(locale);
  const direction = getDirection(locale);
  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${mabry.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <Toaster position="bottom-right" />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
