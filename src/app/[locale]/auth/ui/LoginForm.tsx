"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackURL") || "/project";
  const [guestLoading, setGuestLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const t = useTranslations("loginForm");

  async function signInWithSocial(provider: "google" | "github") {
    const setLoading =
      provider === "google" ? setGoogleLoading : setGithubLoading;

    setLoading(true);

    await authClient.signIn.social({
      provider,
      callbackURL: callbackURL,
      fetchOptions: {
        onSuccess: () => {
          toast.success(
            provider === "google"
              ? t("toast.successGoogle")
              : t("toast.successGithub"),
          );
          setLoading(false);
        },
        onError: (error) => {
          console.log(error.error.message);
          toast.error(t("toast.error"));
          setLoading(false);
        },
      },
    });
  }

  async function signInAsGuest() {
    if (guestLoading) return;
    setGuestLoading(true);
    try {
      const existing = await authClient.getSession();
      if (!existing.data) {
        const result = await authClient.signIn.anonymous();
        if (result.error) throw new Error(result.error.message);
      }
      router.push("/project");
      router.refresh();
    } catch {
      toast.error(t("toast.error"));
      setGuestLoading(false);
    }
  }

  return (
    <Card className="bg-card md:min-w-[470px] shadow-xl p-8 mb-6 rounded-3xl">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Sign-in options */}
        <div className="space-y-4">
          {/* Login Buttons */}
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-y-3 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="md:flex-1 h-12 rounded-xl dark:bg-background"
                onClick={() => signInWithSocial("google")}
                disabled={googleLoading || githubLoading || guestLoading}
              >
                {googleLoading ? (
                  <>
                    <Spinner />
                    <span>{t("loading")}</span>
                  </>
                ) : (
                  <span>{t("providers.google")}</span>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 md:flex-1 rounded-xl dark:bg-background"
                onClick={() => signInWithSocial("github")}
                disabled={githubLoading || googleLoading || guestLoading}
              >
                {githubLoading ? (
                  <>
                    <Spinner />
                    <span>{t("loading")}</span>
                  </>
                ) : (
                  <span>{t("providers.github")}</span>
                )}
              </Button>
            </div>
          </div>
          <Button
            className="w-full h-12 rounded-xl"
            onClick={signInAsGuest}
            disabled={
              guestLoading ||
              googleLoading ||
              githubLoading ||
              googleLoading ||
              guestLoading
            }
          >
            {guestLoading ? <Spinner /> : null}
            {guestLoading ? t("loading") : t("guest")}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {t("guestHint")}
          </p>
        </div>

        {/* Terms Notice */}
        <p className="text-center text-xs text-muted-foreground">
          {t.rich("terms.footer", {
            terms: (chunks) => (
              <Link
                href="/terms"
                className="text-primary hover:underline"
                target="_blank"
              >
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link
                href="/privacy"
                className="text-primary hover:underline"
                target="_blank"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </Card>
  );
}
