import { Button } from "@/components/ui/button";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 dark:bg-[#020817] overflow-hidden">
      <div className="container px-4 mx-auto text-center relative">
        {/* Background Decorative Blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl -z-10" />

        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Elevate your productivity
          </h2>
          <p className="text-muted-foreground text-xl">
            Join our early bird community and lock in exclusive pricing for
            life.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {/* 1. Free Plan */}
          <div className="group p-8 rounded-[2.5rem] bg-card dark:bg-background/50 backdrop-blur-sm border border-border dark:hover:border-primary/50 transition-all duration-300 flex flex-col text-left h-full shadow-sm hover:shadow-xl">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Starter
            </h3>
            <div className="text-4xl font-bold mb-6">$0</div>
            <p className="text-sm text-muted-foreground mb-8">
              Essential tools for individuals just starting their journey.
            </p>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                2 Projects
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Unlimited Tasks & Lists
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Pomodoro Focus Timer
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Daily Streak Tracking
              </li>
            </ul>
            <Button
              variant="outline"
              className="w-full rounded-2xl py-6  hover:bg-secondary transition-colors"
            >
              Get Started
            </Button>
          </div>

          {/* 2. Yearly Plan - THE BEST VALUE */}
          <div className="relative p-10 rounded-[2.5rem] bg-card dark:bg-background/50 backdrop-blur-sm border  dark:border-primary/50 flex flex-col text-left  z-20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 p-[1px] rounded-full dark:bg-[linear-gradient(to_right,#dd7ddf,#e1cd86,#bbcb92,#71c2ef,#3bffff,#dd7ddf)] shadow-lg">
              <div className="dark:bg-slate-950 bg-secondary border dark:border-none text-secondary-foreground dark:text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                Most Popular • Save 66%
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">Yearly Pro</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-primary/10  uppercase">
                Early Bird
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-black tracking-tight">$11.99</span>
              <span className="text-muted-foreground line-through text-lg">
                $19.99
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-6">
              Billed annually (only $1/mo)
            </p>

            <div className=" bg-muted/40 text-xs font-bold py-2 px-4 rounded-xl mb-8 text-center">
              🔥 YOU SAVE $23.89 EVERY YEAR
            </div>

            <ul className="space-y-5 mb-10 flex-1">
              <li className="flex items-center gap-3 font-medium">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Everything in Monthly
              </li>
              <li className="flex items-center gap-3 font-medium">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Lifetime price lock
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                All Future Updates
              </li>
            </ul>

            <Button
              variant={"outline"}
              className="w-full rounded-2xl bg-accent dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80 dark:hover:text-primary-foreground  py-6"
            >
              Unlock Pro Access
            </Button>
          </div>

          {/* 3. Monthly Plan */}
          <div className="group p-8 rounded-[2.5rem] bg-card dark:bg-background/50 backdrop-blur-sm border border-border dark:hover:border-primary/50 transition-all duration-300 flex flex-col text-left h-full shadow-sm hover:shadow-xl">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Monthly
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">$1.99</span>
              <span className="text-muted-foreground line-through text-base">
                $2.99
              </span>
              <span className="text-muted-foreground text-sm">/mo</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              Flexible billing for short-term projects and testing.
            </p>
            <ul className="space-y-4 mb-10 flex-1 text-sm">
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Unlimited Projects
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Full Productivity Analytics
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Yearly Activity Heatmap
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Project Performance Tables
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Project Comparison Charts
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="text-primary h-3 w-3" />
                </div>{" "}
                Priority Support
              </li>
            </ul>
            <Button
              variant="outline"
              className="w-full rounded-2xl py-6  hover:bg-secondary transition-colors"
            >
              Subscribe Monthly
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
