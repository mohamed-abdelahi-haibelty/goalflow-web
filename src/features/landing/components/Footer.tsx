import { Link } from "@/i18n/navigation";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xl font-bold text-foreground">Goalflow</span>
            <p className="text-sm text-muted-foreground">
              Master your time. Own your goals.
            </p>
          </div>

          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-red-400 transition-colors"
            >
              Features
            </a>
            <a href="#report" className="hover:text-red-400 transition-colors">
              Report
            </a>
            <Link
              href="/privacy"
              className="hover:text-red-400 transition-colors"
            >
              Privacy
            </Link>
            <Link href="terms" className="hover:text-red-400 transition-colors">
              Terms
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 Goalflow.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
