import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Search, Menu, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a className="flex items-center gap-2">
              <span className="text-2xl font-display font-bold tracking-tight">
                HF <span className="text-primary">Daily</span>
              </span>
            </a>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/">
              <a className={cn("transition-colors hover:text-foreground", location === "/" && "text-foreground")}>
                Latest Papers
              </a>
            </Link>
            <Link href="/top">
              <a className="transition-colors hover:text-foreground">
                Top Rated
              </a>
            </Link>
            <Link href="/collections">
              <a className="transition-colors hover:text-foreground">
                Collections
              </a>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search papers..." 
              className="pl-8 bg-muted/50 border-transparent focus:bg-background focus:border-border transition-all" 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="hidden sm:flex">
              Sign In
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
