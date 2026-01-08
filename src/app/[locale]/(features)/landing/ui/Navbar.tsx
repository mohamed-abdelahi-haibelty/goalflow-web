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
  { name: "Report", href: "#report", isPro: true },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-4 md:grid md:grid-cols-3">
        <div className="flex-1 md:flex-none md:justify-self-start">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-foreground">
              Goalflow
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 justify-self-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-red-400 dark:hover:text-secondary flex items-center gap-1.5"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Area */}
        <div className="flex flex-1 items-center justify-end gap-2 md:flex-none md:justify-self-end">
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
            className="hidden sm:flex bg-secondary text-secondary-foreground hover:opacity-90 font-semibold shadow-sm rounded-[var(--radius)]"
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
                  <Button className="w-full bg-secondary text-primary-foreground h-12 text-lg">
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
