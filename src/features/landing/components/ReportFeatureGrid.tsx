"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

type Item = {
  title: string;
  desc: string;
};

function ReportFeatureGrid({ title, desc }: Item) {
  const offsetX = useMotionValue(-100);
  const offsetY = useMotionValue(-100);
  const maskImage = useMotionTemplate`radial-gradient(100px 100px at ${offsetX}px ${offsetY}px, black, transparent)`;
  const border = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const borderRect = border.current?.getBoundingClientRect();
      if (borderRect) {
        offsetX.set(e.x - borderRect.x);
        offsetY.set(e.y - borderRect.y);
      }
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [offsetX, offsetY]);
  return (
    <div className="p-8 relative rounded-2xl border border-border bg-background/50 backdrop-blur-sm">
      <motion.div
        ref={border}
        className="absolute inset-0 border border-purple-400 rounded-2xl"
        style={{
          maskImage: maskImage,
          WebkitMaskImage: maskImage,
        }}
      ></motion.div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default ReportFeatureGrid;
