import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { mockPapers, Paper } from "@/data/mockPapers";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format, parseISO, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, Share2, Download, ExternalLink, ThumbsUp, MessageSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function Home() {
  const [location, setLocation] = useLocation();
  const [date, setDate] = useState<Date | undefined>(new Date("2023-12-06")); // Default to a date with papers
  const [searchQuery, setSearchQuery] = useState("");

  // Parse ID from URL hash or query if needed, but for now let's just use state or a simple URL param logic if I were using a router that supported it easily for master-detail. 
  // For wouter, simpler to just manage state here or use a query param. 
  // Let's stick to local state for simplicity of the prototype unless deep linking is requested.
  // Actually, let's support deep linking via a simple query param or just local state for now to keep it fast.
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(mockPapers[0]?.id || null);

  const filteredPapers = useMemo(() => {
    return mockPapers.filter(paper => {
      const matchesDate = date ? isSameDay(parseISO(paper.date), date) : true;
      const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDate && matchesSearch;
    });
  }, [date, searchQuery]);

  const selectedPaper = useMemo(() => 
    mockPapers.find(p => p.id === selectedPaperId), 
    [selectedPaperId]
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-[400px] border-r bg-muted/10 flex flex-col shrink-0">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center gap-2">
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
            {filteredPapers.length} Papers Found
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col p-2 gap-2">
            {filteredPapers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No papers found for this date.
                <br />
                Try selecting a different date.
              </div>
            ) : (
              filteredPapers.map((paper: Paper) => (
                <button
                  key={paper.id}
                  onClick={() => setSelectedPaperId(paper.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-lg p-4 text-left text-sm transition-all hover:bg-muted",
                    selectedPaperId === paper.id 
                      ? "bg-primary/10 hover:bg-primary/15 border-l-2 border-primary" 
                      : "bg-transparent border-l-2 border-transparent"
                  )}
                >
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold line-clamp-2 leading-tight">
                        {paper.title}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {paper.abstract}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                        {paper.id}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {paper.upvotes.toLocaleString()} upvotes
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-6 md:p-10">
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
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedPaper.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="font-mono text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2 self-center">
                    {format(parseISO(selectedPaper.date), "MMMM d, yyyy")}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight text-foreground">
                  {selectedPaper.title}
                </h1>

                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {selectedPaper.authors.map((author: string, i: number) => (
                    <span key={i} className="bg-muted/30 px-2 py-1 rounded hover:text-foreground transition-colors cursor-default">
                      {author}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 border-y py-4">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Original
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <div className="flex-1" />
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {selectedPaper.upvotes}
                </Button>
              </div>

              <div className="prose prose-stone dark:prose-invert max-w-none">
                <h3 className="text-lg font-bold font-display">Abstract</h3>
                <p className="leading-relaxed text-muted-foreground text-lg">
                  {selectedPaper.abstract}
                </p>
                
                {/* Simulated content for visual weight */}
                <h3 className="text-lg font-bold font-display mt-8">Key Findings</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Demonstrates superior performance on standard benchmarks compared to previous state-of-the-art models.</li>
                  <li>Introduces a novel architectural modification that improves training efficiency by 15%.</li>
                  <li>Comprehensive ablation studies confirm the contribution of each proposed component.</li>
                </ul>

                <h3 className="text-lg font-bold font-display mt-8">Conclusion</h3>
                <p className="leading-relaxed text-muted-foreground">
                  The results suggest that this approach is a viable path forward for scaling efficient models. Future work will focus on applying this technique to multimodal domains.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <div className="p-4 rounded-full bg-muted/20 mb-4">
                <Search className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">Select a paper to view details</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
