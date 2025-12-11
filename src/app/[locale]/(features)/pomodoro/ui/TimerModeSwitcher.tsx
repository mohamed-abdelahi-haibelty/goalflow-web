import { Button } from "@/components/ui/button";
import { Mode } from "@/generated/prisma/browser";

import React from "react";

interface TimerModeSwitcherProps {
  mode: Mode;
  switchMode: (mode: Mode) => void;
}

const TimerModeSwitcher: React.FC<TimerModeSwitcherProps> = ({
  mode,
  switchMode,
}) => {
  return (
    <div className="flex rounded-full bg-card p-1 mb-12 border-dashed border">
      {(["POMODORO", "SHORT_BREAK", "LONG_BREAK"] as Mode[]).map((m) => (
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
      ))}
    </div>
  );
};

export default TimerModeSwitcher;
