"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom"; // Needed to force React to update immediately

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Create a ref to store the button element for position calculation
  const ref = React.useRef<HTMLButtonElement>(null);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    // 1. Check if the browser supports View Transitions
    if (
      !ref.current ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Fallback for older browsers or reduced motion
      setTheme(newTheme);
      return;
    }

    // 2. Get the click position (center of the button)
    const { top, left, width, height } = ref.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    // 3. Calculate the radius to the furthest corner of the screen
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    // 4. Perform the transition
    const transition = document.startViewTransition(() => {
      // Force React to update the DOM synchronously
      flushSync(() => {
        setTheme(newTheme);
      });
    });

    // 5. Animate the circle clip-path
    await transition.ready;

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${maxRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      {
        clipPath: clipPath,
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="overflow-hidden" // Keeps the ripple clean
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
