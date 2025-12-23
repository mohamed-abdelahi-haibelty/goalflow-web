"use client";
import { useTheme } from "next-themes";
import ReportFeatureGrid from "./ReportFeatureGrid";
import { useEffect, useState } from "react";

export function ProReportsSection() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const reportImage =
    resolvedTheme === "dark"
      ? "/images/full-report.png"
      : "/images/full-report-light.png";
  return (
    <section className="py-24 bg-card border-y border-border relative overflow-hidden">
      {/* Decorative gradient for the Pro section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
            Goalflow Pro
          </h2>
          <h3 className="text-4xl font-extrabold mb-6">
            You can't improve what you don't measure.
          </h3>
          <p className="text-lg text-muted-foreground">
            Go beyond just ticking boxes. Pro gives you a data-driven blueprint
            of your productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Visual Consistency",
              desc:
                "A full-year activity heatmap. See exactly which days you crushed it and where you slacked off. Fill the grid and gamify your year.",
            },
            {
              title: "Master Your Efficiency",
              desc:
                "Dive into the Performance Table. Track completion rates and total focus hours per project. Stop guessing how long tasks take—start knowing.",
            },
            {
              title: "Know Your ROI",
              desc:
                "Which project is taking up 80% of your time but giving 20% of the results? The Project Comparison Chart tells you the truth about your workload.",
            },
          ].map((item, i) => (
            <ReportFeatureGrid {...item} key={i} />
          ))}
        </div>

        {/* This is where you place the full Reports dashboard screenshot */}
        <div className="mt-16 rounded-2xl border border-border bg-background overflow-hidden shadow-2xl">
          <img
            src={reportImage}
            alt="Pro Analytics Dashboard"
            className="w-full h-auto p-4"
          />
        </div>
      </div>
    </section>
  );
}
