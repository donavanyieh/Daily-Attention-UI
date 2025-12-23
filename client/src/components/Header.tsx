import { Link, useLocation } from "wouter";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background h-16 flex items-center shrink-0">
      <div className="container mx-auto flex items-center gap-6 px-4 w-full">
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">
              Daily <span className="text-primary">Attention</span>
            </span>
          </a>
        </Link>
        
        <div className="h-8 w-px bg-border" />
        
        <nav className="flex items-center gap-6">
          <Link href="/">
            <a
              className={cn(
                "text-sm transition-colors hover:text-primary",
                location === "/" 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground font-medium"
              )}
            >
              Daily TLDR
            </a>
          </Link>
          <Link href="/explore-papers">
            <a
              className={cn(
                "text-sm transition-colors hover:text-primary",
                location === "/explore-papers" 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground font-medium"
              )}
            >
              Explore Papers
            </a>
          </Link>
          <Link href="/changelog">
            <a
              className={cn(
                "text-sm transition-colors hover:text-primary",
                location === "/changelog" 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground font-medium"
              )}
            >
              Changelog
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
