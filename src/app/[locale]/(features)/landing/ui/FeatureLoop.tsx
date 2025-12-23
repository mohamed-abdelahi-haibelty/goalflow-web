import { Kanban, Timer, Zap } from "lucide-react";

function FeatureLoop() {
  // We store both paths in the data structure now
  const features = [
    {
      title: "Organize Without Friction",
      description:
        "Create unlimited lists and tasks with zero setup time. Drag, drop, and organize your life—whether it's a software sprint, a thesis paper, or a freelance gig.",
      icon: Kanban,
      imageLight: "/images/feature-board-light.png",
      imageDark: "/images/feature-board.png",
      align: "left",
    },
    {
      title: "One-Click Deep Focus",
      description:
        "Don’t just check a box—do the work. Click any task to instantly launch a customizable Pomodoro timer. Track Work, Short Breaks, and Long Breaks without leaving your workflow.",
      icon: Timer,
      imageLight: "/images/pomo-timer-light.png",
      imageDark: "/images/pomo-timer.png",
      align: "right",
    },
    {
      title: "Don't Break the Chain",
      description:
        "Consistency is the secret to success. Our built-in Streak System keeps you accountable. Show up, do one session, and watch your streak grow.",
      icon: Zap,
      imageLight: "/images/feature-streak-light.png",
      imageDark: "/images/feature-streak.png",
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
              <h3 className="text-3xl font-bold tracking-tight">
                {feature.title}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>

            {/* Image Container */}
            <div className="flex-1 w-full rounded-2xl border border-border bg-muted/30 dark:bg-muted/30 p-0.5 dark:p-4 shadow-sm">
              {/* Light Mode Image */}
              <img
                src={feature.imageLight}
                alt={feature.title}
                className="rounded-xl shadow-lg w-full h-auto dark:hidden block"
              />
              {/* Dark Mode Image */}
              <img
                src={feature.imageDark}
                alt={feature.title}
                className="rounded-xl shadow-lg w-full h-auto hidden dark:block"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureLoop;
