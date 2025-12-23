"use client";
import { Kanban, Timer, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function FeatureLoop() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const boardImage =
    resolvedTheme === "dark"
      ? "/images/feature-board.png"
      : "/images/feature-board-light.png";

  const timerImage =
    resolvedTheme === "dark"
      ? "/images/pomo-timer.png"
      : "/images/pomo-timer-light.png";

  const streakImage =
    resolvedTheme === "dark"
      ? "/images/feature-streak.png"
      : "/images/feature-streak-light.png";

  const features = [
    {
      title: "Organize Without Friction",
      description:
        "Create unlimited lists and tasks with zero setup time. Drag, drop, and organize your life—whether it's a software sprint, a thesis paper, or a freelance gig.",
      icon: Kanban,
      image: boardImage,
      align: "left",
    },
    {
      title: "One-Click Deep Focus",
      description:
        "Don’t just check a box—do the work. Click any task to instantly launch a customizable Pomodoro timer. Track Work, Short Breaks, and Long Breaks without leaving your workflow.",
      icon: Timer,
      image: timerImage,
      align: "right",
    },
    {
      title: "Don't Break the Chain",
      description:
        "Consistency is the secret to success. Our built-in Streak System keeps you accountable. Show up, do one session, and watch your streak grow.",
      icon: Zap,
      image: streakImage,
      align: "left",
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col lg:flex-row items-center gap-12 mb-24 last:mb-0 ${
              feature.align === "right" ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className="flex-1 space-y-6">
              <div className="h-12 w-12 rounded-lg bg-muted/60 dark:bg-primary/10 flex items-center justify-center dark:text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight">
                {feature.title}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
            <div className="flex-1 w-full rounded-2xl border border-border bg-muted/30 dark:bg-muted/30 p-0.5 dark:p-4 shadow-sm">
              <img
                src={feature.image}
                alt={feature.title}
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureLoop;
