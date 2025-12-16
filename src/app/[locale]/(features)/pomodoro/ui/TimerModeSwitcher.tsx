"use client";
import { Button } from "@/components/ui/button";
import { Mode } from "@/generated/prisma/browser";
import { MODE_I18N_KEY } from "@/lib/utils";
import { useTranslations } from "next-intl";

import React from "react";

interface TimerModeSwitcherProps {
  mode: Mode;
  switchMode: (mode: Mode) => void;
}

const TimerModeSwitcher: React.FC<TimerModeSwitcherProps> = ({
  mode,
  switchMode,
}) => {
  const t = useTranslations();
  return (
    <div className="flex rounded-full bg-card p-1 mb-12 border-dashed border">
      {/* {(["POMODORO", "SHORT_BREAK", "LONG_BREAK"] as Mode[]).map((m) => (
        <Button
          key={m}
          variant={mode === m ? "default" : "ghost"}
          className={`rounded-full px-6 ${
            mode === m
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => switchMode(m)}
        >
          {m.replace("_", " ")}
        </Button>
      ))} */}

      {(Object.keys(MODE_I18N_KEY) as Mode[]).map((m) => (
        <Button
          key={m}
          variant={mode === m ? "default" : "ghost"}
          className={`rounded-full px-6 ${
            mode === m
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => switchMode(m)}
        >
          {t(MODE_I18N_KEY[m])}
        </Button>
      ))}
    </div>
  );
};

export default TimerModeSwitcher;
