"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const t = useTranslations("loginForm");

  async function signInWithSocial(provider: "google" | "github") {
    const setLoading =
      provider === "google" ? setGoogleLoading : setGithubLoading;

    setLoading(true);

    await authClient.signIn.social({
      provider,
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          toast.success(
            provider === "google"
              ? t("toast.successGoogle")
              : t("toast.successGithub")
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
    <Card className="bg-card min-w-[470px] shadow-xl p-8 mb-6 rounded-3xl">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col md:flex-row gap-y-3 gap-3">
            <Button
              variant="outline"
              size="lg"
              className=" md:flex-1 h-12 rounded-xl dark:bg-background"
              onClick={() => signInWithSocial("google")}
              disabled={googleLoading}
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
              className=" h-12 md:flex-1 rounded-xl dark:bg-background"
              onClick={() => signInWithSocial("github")}
              disabled={githubLoading}
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
      </div>
    </Card>
  );
}
