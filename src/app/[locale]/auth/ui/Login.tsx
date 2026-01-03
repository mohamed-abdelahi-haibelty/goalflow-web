import Link from "next/link";
import LoginForm from "./LoginForm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/ModeToggle";

export default async function Login() {
  const t = await getTranslations("loginPage");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/project");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-secondary/50 via-background to-accent/10 overflow-hidden">
      <div className="absolute top-5 right-6 px-8 z-50">
        <LanguageSwitcher />
        <ModeToggle />
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="w-full  md:max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-1">
              {t("appName")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          {/* Login card */}
          <LoginForm />

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>
              {t("footer.prefix")}{" "}
              <Link
                href="/terms"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {t("footer.terms")}
              </Link>{" "}
              {t("footer.and")}{" "}
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {t("footer.privacy")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
