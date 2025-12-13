import { Link } from "wouter";
import { Zap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background h-16 flex items-center shrink-0">
      <div className="container mx-auto flex items-center justify-between px-4 w-full">
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">
              TechNews<span className="text-primary">Now</span>
            </span>
          </a>
        </Link>
        
        <div className="text-sm text-muted-foreground font-medium hidden sm:block">
          AI Research Summaries & Insights
        </div>
      </div>
    </header>
  );
}
