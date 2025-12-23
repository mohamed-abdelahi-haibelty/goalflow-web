import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroBackup() {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-20 lg:pt-24 pb-32 bg-background">
      {/* Subtle background glow effect behind the hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[100px] -z-10 rounded-full pointer-events-none" />

      <div className="container px-4 mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Column: Text Content */}
          <div className="flex flex-col justify-center max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            {/* A small "hook" badge */}
            <div className="inline-flex items-center rounded-full border border-primary/20  px-3 py-1 text-sm font-medium text-primary mb-6 w-fit mx-auto lg:mx-0">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse mr-2"></span>
              The Missing Link Between Planning & Doing
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
              Stop Planning. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-primary">
                Start Flowing.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Most apps just let you list your tasks. <strong>Goalflow</strong>
              helps you actually finish them. The all-in-one workspace combining
              visual project management with deep-focus timers.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                className="h-12 px-8 bg-primary text-lg font-semibold group text-primary-foreground hover:opacity-90 rounded-[var(--radius)] shadow-md"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <span className="text-sm text-muted-foreground">
                No credit card required.
              </span>
            </div>

            {/* Quick Social Proof/Key Benefits */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
              <span className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Visualize
                Work
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Focus
                Timer
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Track
                Progress
              </span>
            </div>
          </div>

          {/* Right Column: Browser Mockup Image */}
          <div className="relative mx-auto w-full max-w-[800px] lg:ml-auto perspective-1000">
            {/* The Browser Frame */}
            <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden transition-transform hover:scale-[1.01] duration-500 ease-out group-hover:shadow-[0_20px_80px_-10px_var(--primary)]">
              {/* Browser Header Bar */}
              <div className="flex items-center px-4 py-3 border-b border-border/50 bg-muted/50">
                <div className="flex space-x-2 absolute">
                  <div className="w-3 h-3 bg-[#FF5F56] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#FFBD2E] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#27C93F] rounded-full"></div>
                </div>
                <div className="w-full flex justify-center">
                  <div className="px-4 py-1 bg-background/80 text-xs text-muted-foreground rounded-md border border-border/50 flex items-center max-w-[200px]">
                    🔒 goalflow.app/dashboard
                  </div>
                </div>
              </div>

              {/* The Application Screenshot */}
              <div className="relative  w-full bg-background">
                {/* IMPORTANT: Replace src="/images/hero-dashboard.png" below 
                   with the actual path to your screenshot (e.g., a clean shot based on image_1.png).
                */}
                <Image
                  src="/images/hero.png"
                  alt="Goalflow Project Board Interface showing kanban columns and tasks"
                  width={1920} // Replace with your actual screenshot width
                  height={1080} // Replace with your actual screenshot height
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>

            {/* Decorational Elements around the image */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/30 blur-[80px] -z-10 rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-orange-500/20 blur-[80px] -z-10 rounded-full pointer-events-none mix-blend-screen" />
          </div>
        </div>
      </div>
    </section>
  );
}
