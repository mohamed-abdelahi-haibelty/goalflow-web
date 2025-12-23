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
              className="hover:text-primary transition-colors"
            >
              Features
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 Goalflow.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
