"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ModeToggle";
import GlobeLanguageSwitcher from "./GlobeLanguageSwitcher";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing", isPro: true },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:scale-110"
          >
            <path
              d="M34.5 16.5C33.5 13.5 31 11 27.5 10C22.5 8.5 17 11.5 15.5 16.5C14 21.5 17 27 22 28.5C25.5 29.5 29 28.5 31.5 26L40 34.5L46 22"
              stroke="var(--primary)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Goalflow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1.5"
            >
              {link.name}
              {link.isPro && (
                <span className="rounded-full bg-accent/50 dark:bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground dark:text-primary border border-accent/20 dark:border-primary/20">
                  Pro
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Action Area */}
        <div className="flex items-center gap-2 md:gap-4">
          <GlobeLanguageSwitcher />

          <ModeToggle />

          <Link
            href="/auth"
            className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-2"
          >
            Log In
          </Link>

          <Button
            asChild
            className="hidden sm:flex bg-primary text-primary-foreground hover:opacity-90 font-semibold shadow-sm rounded-[var(--radius)]"
          >
            <Link href="/auth">Start for Free</Link>
          </Button>

          {/* Mobile Menu (Sheet) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-background border-l border-border"
              >
                <SheetHeader>
                  <SheetTitle className="text-left">Goalflow</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6  mx-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium text-foreground hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <hr className="border-border" />
                  <Link
                    href="/login"
                    className="text-lg font-medium text-muted-foreground"
                  >
                    Log In
                  </Link>
                  <Button className="w-full bg-primary text-primary-foreground h-12 text-lg">
                    Start for Free
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
