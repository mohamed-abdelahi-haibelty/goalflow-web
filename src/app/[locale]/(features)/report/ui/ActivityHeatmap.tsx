"use client";

import { useTranslations } from "next-intl";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  subDays,
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  getDay,
  subWeeks,
  getYear,
  startOfYear,
  endOfYear,
} from "date-fns";
import { HeatmapData } from "../action/getReport";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface ActivityHeatmapProps {
  data: HeatmapData[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const t = useTranslations("report.heatmap");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Determine Selected Year
  const currentYear = new Date().getFullYear();
  // Try to get year from URL, fallback to current year
  const selectedYear = Number(searchParams.get("year")) || currentYear;

  // Generate list of years for the dropdown (e.g., from 2024 up to current year)
  // You might want to pass 'availableYears' as a prop in the future,
  // but for now we can generate a simple range or hardcode current + prev.
  const years = Array.from({ length: 2 }, (_, i) => currentYear - i); // [2026, 2025, 2024]

  // 2. Generate Calendar Grid for the Selected Year
  const { weeks, monthLabels } = useMemo(() => {
    // Create a date object for Jan 1st of selected year
    const yearStart = startOfYear(new Date(selectedYear, 0, 1));
    const yearEnd = endOfYear(new Date(selectedYear, 0, 1));

    // Align grid to full weeks (Sun-Sat or Mon-Sun depending on locale default)
    const startDate = startOfWeek(yearStart);
    const endDate = endOfWeek(yearEnd);

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Group days into weeks
    const weeksArr: Date[][] = [];
    let currentWeek: Date[] = [];

    allDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) {
      weeksArr.push(currentWeek);
    }

    // Generate Month Labels
    const labels: { label: string; weekIndex: number }[] = [];
    weeksArr.forEach((week, index) => {
      const firstDay = week[0];
      // Logic: If it's the first week OR the month changed compared to previous week's first day
      // AND the first day is actually within the selected year (avoids Dec label appearing at start of grid)
      const isNewMonth =
        index === 0 || !isSameMonth(firstDay, weeksArr[index - 1][0]);

      if (isNewMonth && getYear(firstDay) === selectedYear) {
        labels.push({
          label: format(firstDay, "MMM"),
          weekIndex: index,
        });
      }
    });

    return { weeks: weeksArr, monthLabels: labels };
  }, [selectedYear]);

  // 3. Handle Year Change
  const handleYearChange = (newYear: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("year", newYear);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Helper: Format tooltip time
  const formatTooltipTime = (seconds: number) => {
    if (seconds === 0) return t("noActivity");
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (h > 0) return `${h}h:${m.toString().padStart(2, "0")} min`;
    return `${m} min`;
  };

  // Helper: Get color intensity
  const getColor = (duration: number) => {
    if (duration === 0) return "bg-muted/40"; // Empty
    if (duration < 15 * 60) return "bg-primary/40";
    if (duration < 60 * 60) return "bg-primary/60";
    if (duration < 120 * 60) return "bg-primary/80";
    return "bg-primary";
  };

  return (
    <div className="flex flex-col gap-4 w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{t("title")}</h3>
        {/* <span className="text-xs text-muted-foreground">{t("lastYear")}</span> */}
        {/* Year Switcher */}
        <Select
          value={selectedYear.toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="text-xs bg-transparent border-border text-muted-foreground">
            <SelectValue placeholder={selectedYear} />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem
                key={year}
                value={year.toString()}
                className="text-xs"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Scrollable Container for the Grid */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-max">
          {/* Month Labels Row */}
          <div className="flex text-xs text-muted-foreground mb-2 relative h-4">
            {monthLabels.map((m, i) => (
              // Approximate positioning based on week width (w-3 + gap-1 = 1rem roughly)
              <span
                key={`${m.label}-${i}`}
                className="absolute"
                style={{ left: `${m.weekIndex * 14}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day Labels (Mon/Wed/Fri) */}
            <div className="flex flex-col gap-1 pr-2 text-[10px] text-muted-foreground leading-3 pt-[2px]">
              <div className="h-3"></div> {/* Sun placeholder */}
              <div className="h-3">Mon</div>
              <div className="h-3"></div>
              <div className="h-3">Wed</div>
              <div className="h-3"></div>
              <div className="h-3">Fri</div>
              <div className="h-3"></div>
            </div>

            {/* The Grid */}
            <TooltipProvider delayDuration={50}>
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day) => {
                      const dateKey = format(day, "yyyy-MM-dd");
                      const dayData = data.find((d) => d.date === dateKey) || {
                        count: 0,
                        duration: 0,
                      };

                      // Hide days that are part of the week grid but not in the selected year
                      // (optional style choice, keeps the grid looking clean)
                      const isDayInYear = getYear(day) === selectedYear;

                      return (
                        <Tooltip key={dateKey}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "h-3 w-3 rounded-sm duration-150",
                                !isDayInYear && "opacity-20", // Dim days outside selected year
                                isDayInYear &&
                                  "hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background",
                                getColor(dayData.duration)
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <div className="text-xs space-y-1">
                              <p className="font-semibold ">
                                {format(day, "PPP")}
                              </p>
                              <div className="flex flex-col gap-0.5">
                                <span>
                                  {t("timeWorked")}:{" "}
                                  <span>
                                    {formatTooltipTime(dayData.duration)}
                                  </span>
                                </span>
                                <span>
                                  {t("sessions")}: <span>{dayData.count}</span>
                                </span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-muted/40" />
        <div className="h-3 w-3 rounded-sm bg-primary/40" />
        <div className="h-3 w-3 rounded-sm bg-primary/60" />
        <div className="h-3 w-3 rounded-sm bg-primary/80" />
        <div className="h-3 w-3 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}
