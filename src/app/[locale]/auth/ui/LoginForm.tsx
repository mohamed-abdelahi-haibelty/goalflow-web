"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Add if not exists
import { Label } from "@/components/ui/label"; // Add if not exists
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackURL") || "/project";
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const t = useTranslations("loginForm");

  async function signInWithSocial(provider: "google" | "github") {
    if (!agreedToTerms) {
      toast.error(t("terms.notAccepted"));
      return;
    }

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

  return (
    <Card className="bg-card md:min-w-[470px] shadow-xl p-8 mb-6 rounded-3xl">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Terms Agreement Section */}
        <div className="space-y-4">
          {/* Login Buttons */}
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-y-3 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="md:flex-1 h-12 rounded-xl dark:bg-background"
                onClick={() => signInWithSocial("google")}
                disabled={googleLoading || !agreedToTerms}
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
                disabled={githubLoading || !agreedToTerms}
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
          <div className="flex items-start space-x-3 p-4  rounded-lg bg-muted/50">
            <Checkbox
              id="terms-agreement"
              checked={agreedToTerms}
              onCheckedChange={(checked) =>
                setAgreedToTerms(checked as boolean)
              }
              className="mt-1 dark:border-primary"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms-agreement"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("terms.title")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t.rich("terms.description", {
                  terms: (chunks) => (
                    <Link
                      href="/terms"
                      className="text-primary hover:underline font-medium"
                      target="_blank"
                    >
                      {chunks}
                    </Link>
                  ),
                  privacy: (chunks) => (
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline font-medium"
                      target="_blank"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </div>
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
