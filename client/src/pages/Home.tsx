import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { mockPapers, Paper } from "@/data/mockPapers";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, parseISO, isSameDay } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Search, 
  ExternalLink, 
  Github, 
  Database, 
  Globe, 
  Lightbulb, 
  Target,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Home() {
  const [location, setLocation] = useLocation();
  const [date, setDate] = useState<Date | undefined>(new Date("2023-12-06"));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(mockPapers[0]?.id || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredPapers = useMemo(() => {
    return mockPapers.filter(paper => {
      const matchesDate = date ? isSameDay(parseISO(paper.date), date) : true;
      const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           paper.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDate && matchesSearch;
    });
  }, [date, searchQuery]);

  const selectedPaper = useMemo(() => 
    mockPapers.find(p => p.id === selectedPaperId), 
    [selectedPaperId]
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background relative">
      {/* Sidebar */}
      <AnimatePresence initial={false} mode="popLayout">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-r bg-muted/10 flex flex-col shrink-0 overflow-hidden whitespace-nowrap"
          >
            <div className="w-[400px] flex flex-col h-full"> {/* Fixed width container to prevent content squashing */}
              <div className="p-4 border-b space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSidebarOpen(false)}
                    className="shrink-0"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter papers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {filteredPapers.length} Updates
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="flex flex-col p-2 gap-2">
                  {filteredPapers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      No updates found for this date.
                      <br />
                      Try selecting a different date.
                    </div>
                  ) : (
                    filteredPapers.map((paper: Paper) => (
                      <button
                        key={paper.id}
                        onClick={() => setSelectedPaperId(paper.id)}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-lg p-4 text-left text-sm transition-all hover:bg-muted group whitespace-normal",
                          selectedPaperId === paper.id 
                            ? "bg-primary/10 hover:bg-primary/15 border-l-2 border-primary" 
                            : "bg-transparent border-l-2 border-transparent"
                        )}
                      >
                        <div className="flex w-full flex-col gap-1">
                          <div className="flex items-center justify-between w-full">
                            <span className={cn(
                              "font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors",
                              selectedPaperId === paper.id ? "text-primary" : "text-foreground"
                            )}>
                              {paper.title}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2 mt-1 font-medium">
                            {paper.summary}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-mono">
                              {paper.id}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground ml-auto bg-muted/50 px-1.5 rounded">
                              {format(parseISO(paper.date), "MMM d")}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-6 md:p-10 relative">
        <div className="absolute top-4 left-4 z-10">
           {!isSidebarOpen && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="bg-background/80 backdrop-blur-sm shadow-sm"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
           )}
        </div>

        <AnimatePresence mode="wait">
          {selectedPaper ? (
            <motion.div
              key={selectedPaper.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="space-y-4 border-b pb-8">
                <div className="flex flex-wrap gap-2">
                  {selectedPaper.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="font-mono text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2 self-center">
                    Published {format(parseISO(selectedPaper.date), "MMMM d, yyyy")}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight text-foreground">
                  {selectedPaper.title}
                </h1>

                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground items-center pt-2">
                  <span className="font-medium mr-2">Authors:</span>
                  {selectedPaper.authors.map((author: string, i: number) => (
                    <span key={i} className="bg-muted/30 px-2 py-1 rounded hover:text-foreground transition-colors cursor-default">
                      {author}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-6">
                {/* 1. Summary Card */}
                <Card className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-display">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Generated Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-lg leading-relaxed text-foreground/90 font-medium">
                      {selectedPaper.summary}
                    </p>
                  </CardContent>
                </Card>

                {/* 2. Key Points Card */}
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="text-xl font-display">Key Points</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="grid gap-3">
                      {selectedPaper.keyPoints.map((point: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary ring-1 ring-primary/30 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* 3. Impact Card */}
                <Card className="overflow-hidden border-l-4 border-l-destructive shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-destructive/5 pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-display text-destructive">
                      <Target className="h-5 w-5" />
                      Why This Matters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                     <p className="text-lg text-muted-foreground leading-relaxed italic">
                      "{selectedPaper.impact}"
                    </p>
                  </CardContent>
                </Card>

                {/* 4. Relevant Links Card */}
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                   <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="text-xl font-display">Relevant Links</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPaper.links.project && (
                        <a 
                          href={selectedPaper.links.project} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all group"
                        >
                          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <Globe className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">Project Page</div>
                            <div className="text-xs text-muted-foreground truncate">Official Website</div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}

                      {selectedPaper.links.github && (
                        <a 
                          href={selectedPaper.links.github} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all group"
                        >
                          <div className="h-10 w-10 rounded-full bg-stone-500/10 flex items-center justify-center text-stone-600 dark:text-stone-400 group-hover:scale-110 transition-transform">
                            <Github className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">Repository</div>
                            <div className="text-xs text-muted-foreground truncate">View Code</div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}

                      {selectedPaper.links.data && (
                        <a 
                          href={selectedPaper.links.data} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all group"
                        >
                          <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                            <Database className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">Dataset</div>
                            <div className="text-xs text-muted-foreground truncate">Hugging Face</div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Original Abstract Accordion (at the bottom) */}
                <div className="pt-4">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center gap-2 font-medium text-muted-foreground hover:text-foreground select-none">
                      <span>Read Original Abstract</span>
                      <span className="transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <Card className="mt-4 border-dashed">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedPaper.abstract}
                        </p>
                      </CardContent>
                    </Card>
                  </details>
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <div className="p-4 rounded-full bg-muted/20 mb-4">
                <Search className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">Select a paper to view the summary</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
