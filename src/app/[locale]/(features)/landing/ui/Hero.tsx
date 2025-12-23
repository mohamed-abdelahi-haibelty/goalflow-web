"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import underlineImage from "../../../../../../public/images/underline.svg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";

export function HeroSection() {
  const appImage = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: appImage,
    offset: ["start end", "end end"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <section className="relative overflow-hidden pt-12  pb-32 bg-background">
      {/* Subtle background glow effect behind the hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[100px] -z-10 rounded-full pointer-events-none" />

      <div className="container px-4 mx-auto relative">
        <div className="absolute hidden lg:block">
          <div className="dark:hidden block">
            <Image
              width={300}
              height={300}
              src="/images/feature-timer-light.png"
              alt="Pomodoro Timer"
            />
          </div>
          {/* Dark Mode Timer */}
          <div className="hidden dark:block">
            <Image
              width={300}
              height={300}
              src="/images/feature-timer.png"
              alt="Pomodoro Timer"
            />
          </div>
        </div>

        {/* hero Text Content */}
        <div className="flex flex-col justify-center max-w-xl mx-auto  text-center">
          {/* A small "hook" badge */}
          <div className="inline-flex items-center rounded-full text-accent-foreground dark:border  dark:bg-transparent border-none  px-3 py-1 text-sm font-medium dark:text-primary mb-6 w-fit mx-auto">
            Finally, a project board that actually tracks the time you spend
            working.
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
            Plan in minutes.
            <br className="hidden sm:inline" />
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-primary">
                Focus for hours.
              </span>
              <span
                className="absolute w-full h-4 left-0 top-full -translate-y-1/2 bg-[linear-gradient(to_right,#FBBF24,#2DD4BF,#8B5CF6,#D946EF)]"
                style={{
                  maskImage: `url(${underlineImage.src})`,
                  maskSize: "contain",
                  maskPosition: "center",
                  maskRepeat: "no-repeat",
                }}
              />
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            We built <strong>Goalflow</strong> because jumping between{" "}
            <strong>three different apps</strong> just to finish one task isn't
            productive—it's exhausting. We put your project board and your focus
            timer in one place, so when you’re ready to work, you can just...
            work.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center  mb-8">
            <Button
              size="lg"
              className="h-12 px-8 bg-primary text-lg font-semibold group text-primary-foreground hover:opacity-90 rounded-[var(--radius)] shadow-md"
            >
              <Link href="/auth">Get Started for Free</Link>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <span className="text-sm text-muted-foreground">
              No credit card required.
            </span>
          </div>

          {/* Quick Social Proof/Key Benefits */}
          <div className="flex flex-wrap items-center justify-center  gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Visualize
              Work
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Focus Timer
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Track
              Progress
            </span>
          </div>
        </div>

        {/* Browser Mockup Image */}
        <div className="relative mt-14 mx-auto w-full max-w-[800px] lg:ml-auto perspective-1000">
          {/* The Browser Frame */}
          <motion.div
            style={{
              opacity: opacity,
              rotateX: rotateX,
              transformPerspective: "800px",
            }}
            ref={appImage}
            className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden transition-transform hover:scale-[1.01] duration-500 ease-out group-hover:shadow-[0_20px_80px_-10px_var(--primary)]"
          >
            {/* Browser Header Bar */}
            <div className="flex items-center px-4 py-3 border-b border-border/50 bg-muted/50">
              <div className="flex space-x-2 absolute">
                <div className="w-3 h-3 bg-[#FF5F56] rounded-full"></div>
                <div className="w-3 h-3 bg-[#FFBD2E] rounded-full"></div>
                <div className="w-3 h-3 bg-[#27C93F] rounded-full"></div>
              </div>
              <div className="w-full flex justify-center">
                <div className="px-4 py-1 bg-background/80 text-xs text-muted-foreground rounded-md border border-border/50 flex items-center max-w-[200px]">
                  🔒 goalflow.app/project
                </div>
              </div>
            </div>

            {/* The Application Screenshot */}
            <div className="relative  w-full bg-background">
              {/* Light Mode Hero */}
              <Image
                src="/images/hero-light.png"
                alt="Goalflow Interface Light"
                width={1920}
                height={1080}
                className="object-cover object-top dark:hidden block"
                priority // Important for Hero LCP
              />
              {/* Dark Mode Hero */}
              <Image
                src="/images/hero.png"
                alt="Goalflow Interface Dark"
                width={1920}
                height={1080}
                className="object-cover object-top hidden dark:block"
                priority // Important for Hero LCP
              />
            </div>
          </motion.div>

          {/* Decorational Elements around the image */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/30 blur-[80px] -z-10 rounded-full pointer-events-none mix-blend-screen" />
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-orange-500/20 blur-[80px] -z-10 rounded-full pointer-events-none mix-blend-screen" />
        </div>
      </div>
    </section>
  );
}
