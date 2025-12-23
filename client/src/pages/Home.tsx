import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { type Paper } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
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
  Zap,
  MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Home() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [, setLocation] = useLocation();

  // Fetch available dates for calendar
  const { data: availableDates = [] } = useQuery<string[]>({
    queryKey: ["/api/papers/dates"],
    queryFn: async () => {
      const response = await fetch("/api/papers/dates");
      if (!response.ok) {
        throw new Error("Failed to fetch paper dates");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch latest date papers on initial load
  const { data: latestDateData } = useQuery<{ date: string; papers: Paper[] }>({
    queryKey: ["/api/papers/latest-date"],
    queryFn: async () => {
      const response = await fetch("/api/papers/latest-date");
      if (!response.ok) {
        throw new Error("Failed to fetch latest date papers");
      }
      return response.json();
    },
  });

  // Fetch papers for selected date (lazy loading)
  const selectedDateString = date ? format(date, "yyyy-MM-dd") : null;
  const { data: papersForDate = [], isLoading: isLoadingPapers } = useQuery<Paper[]>({
    queryKey: ["/api/papers/by-date", selectedDateString],
    queryFn: async () => {
      if (!selectedDateString) return [];
      const response = await fetch(`/api/papers/by-date/${selectedDateString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch papers by date");
      }
      return response.json();
    },
    enabled: !!selectedDateString,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Set default to latest date with papers and select first paper
  useEffect(() => {
    if (latestDateData && !date) {
      const latestDate = parseISO(latestDateData.date);
      setDate(latestDate);
      
      // Select the first paper from that date
      if (latestDateData.papers.length > 0) {
        setSelectedPaperId(latestDateData.papers[0].id);
      }
    }
  }, [latestDateData, date]);

  // Use papers from either latest date query or by-date query
  const papers = useMemo(() => {
    if (!date) return [];
    
    // If we're looking at the latest date, use latestDateData
    if (latestDateData && format(parseISO(latestDateData.date), "yyyy-MM-dd") === selectedDateString) {
      return latestDateData.papers;
    }
    
    // Otherwise use the by-date query results
    return papersForDate;
  }, [date, latestDateData, papersForDate, selectedDateString]);

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const matchesDate = date ? isSameDay(parseISO(paper.date), date) : true;
      const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           paper.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDate && matchesSearch;
    });
  }, [papers, date, searchQuery]);

  const selectedPaper = useMemo(() => 
    papers.find((p) => p.id === selectedPaperId), 
    [papers, selectedPaperId]
  );

  // Get unique dates that have papers from API
  const datesWithPapers = useMemo(() => {
    return availableDates.map((dateString) => {
      const paperDate = parseISO(dateString);
      // Normalize to start of day for comparison
      return new Date(paperDate.getFullYear(), paperDate.getMonth(), paperDate.getDate());
    });
  }, [availableDates]);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background relative">
      {/* Sidebar - Always Visible */}
      <aside className="w-[400px] border-r bg-muted/10 flex flex-col shrink-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-lg">Filters</span>
            </div>

            <div className="flex items-center gap-2">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                <PopoverContent className="w-full p-4" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                    disabled={(date) => date > new Date()}
                    modifiers={{
                      hasPapers: datesWithPapers
                    }}
                    modifiersClassNames={{
                      hasPapers: "has-papers"
                    }}
                    className="calendar-expanded"
                  />
                </PopoverContent>
              </Popover>
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
              {filteredPapers.length} Papers found
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col p-2 gap-2">
              {isLoadingPapers ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span>Loading papers...</span>
                  </div>
                </div>
              ) : filteredPapers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No updates found for this date.
                  <br />
                  Try selecting a different date.
                </div>
              ) : (
                filteredPapers.map((paper) => (
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
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {paper.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-6 md:p-10 relative">
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
                  {selectedPaper.tags.map((tag) => (
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
                  {selectedPaper.authors.map((author, i) => (
                    <span key={i} className="bg-muted/30 px-2 py-1 rounded hover:text-foreground transition-colors cursor-default">
                      {author}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-6">
                {/* Chat with Paper Button */}
                <div className="flex justify-end">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      onClick={() => window.open(`/chat/${selectedPaper.id}`, '_blank')}
                      className="gap-2 shadow-md hover:shadow-lg transition-shadow"
                      size="lg"
                    >
                      <motion.div
                        whileHover={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <MessageSquare className="h-5 w-5" />
                      </motion.div>
                      Chat with Paper (New Window)
                    </Button>
                  </motion.div>
                </div>

                {/* 1. Summary Card */}
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-display">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Technical Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-lg leading-relaxed text-foreground/90 font-medium">
                      {selectedPaper.summary}
                    </p>
                  </CardContent>
                </Card>

                {/* 2. Impact Card */}
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-display">
                      <Zap className="h-5 w-5 text-primary" />
                      Why This Matters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                     <p className="text-lg text-muted-foreground leading-relaxed">
                      {selectedPaper.impact}
                    </p>
                  </CardContent>
                </Card>

                {/* 3. Key Points Card */}
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-display">
                      <Target className="h-5 w-5 text-primary" />
                      Key Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="grid gap-3">
                      {selectedPaper.keyPoints.map((point, i) => (
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

                {/* 4. Relevant Links Card */}
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                   <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-display">
                      <ExternalLink className="h-5 w-5 text-primary" />
                      Relevant Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="grid gap-3">
                      {Object.entries(selectedPaper.links).map(([key, url], i) => (
                        <li key={key} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary ring-1 ring-primary/30 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground leading-relaxed">
                            <span className="font-medium">{key}: </span>
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-primary hover:underline break-all"
                            >
                              {url}
                            </a>
                          </span>
                        </li>
                      ))}
                    </ul>
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
