"use client";

import { Flame } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface StreakCounterProps {
  count: number;
  isActiveToday: boolean; // Did they do a pomodoro today?
}

export function StreakCounter({ count, isActiveToday }: StreakCounterProps) {
  const t = useTranslations("StreakCounter");
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 select-none",
              isActiveToday
                ? " bg-muted/40 border-transparent   text-orange-500"
                : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/60",
            )}
          >
            <div className="relative flex items-center justify-center">
              <Flame
                className={cn(
                  "w-4 h-4 transition-all",
                  isActiveToday
                    ? "fill-orange-500 stroke-orange-600"
                    : "fill-none",
                )}
              />
              {/* Subtle glow effect behind the flame if active */}
              {isActiveToday && (
                <div className="absolute inset-0 blur-sm dark:bg-orange-500/50 animate-pulse" />
              )}
            </div>

            <span className="text-sm font-semibold tabular-nums">{count}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {isActiveToday ? t("streakActive") : t("streakInactive")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
