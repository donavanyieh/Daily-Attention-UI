import { useState, useMemo, useEffect } from "react";
import { type DailySummary } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Lightbulb, 
  Zap,
  Sparkles,
  Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DailyTLDR() {
  const [selectedSummaryDate, setSelectedSummaryDate] = useState<string | null>(null);

  // Fetch daily summaries from API
  const { data: summaries = [] } = useQuery<DailySummary[]>({
    queryKey: ["/api/daily-summaries"],
    queryFn: async () => {
      const response = await fetch("/api/daily-summaries");
      if (!response.ok) {
        throw new Error("Failed to fetch daily summaries");
      }
      return response.json();
    },
  });

  // Sort summaries by date (newest first)
  const sortedSummaries = useMemo(() => {
    return [...summaries].sort((a, b) => 
      parseISO(b.date).getTime() - parseISO(a.date).getTime()
    );
  }, [summaries]);

  // Select the first (most recent) summary by default
  useEffect(() => {
    if (sortedSummaries.length > 0 && !selectedSummaryDate) {
      setSelectedSummaryDate(sortedSummaries[0].date);
    }
  }, [sortedSummaries, selectedSummaryDate]);

  const selectedSummary = useMemo(() => 
    summaries.find((s) => s.date === selectedSummaryDate), 
    [summaries, selectedSummaryDate]
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background relative">
      {/* Sidebar - Always Visible */}
      <aside className="w-[400px] border-r bg-muted/10 flex flex-col shrink-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-lg">Daily Summaries</span>
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {sortedSummaries.length} Total Summaries
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col p-2 gap-2">
              {sortedSummaries.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No summaries available yet.
                </div>
              ) : (
                sortedSummaries.map((summary) => (
                  <button
                    key={summary.date}
                    onClick={() => setSelectedSummaryDate(summary.date)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg p-4 text-left text-sm transition-all hover:bg-muted group whitespace-normal",
                      selectedSummaryDate === summary.date 
                        ? "bg-primary/10 hover:bg-primary/15 border-l-2 border-primary" 
                        : "bg-transparent border-l-2 border-transparent"
                    )}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center justify-between w-full">
                        <span className={cn(
                          "font-bold leading-tight group-hover:text-primary transition-colors",
                          selectedSummaryDate === summary.date ? "text-primary" : "text-foreground"
                        )}>
                          {format(parseISO(summary.date), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-3 mt-1 font-medium">
                        {summary.Summary.substring(0, 150)}...
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
          {selectedSummary ? (
            <motion.div
              key={selectedSummary.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="space-y-4 border-b pb-8">
                <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight text-foreground">
                  Daily TLDR
                </h1>
                <span className="text-lg text-muted-foreground">
                  {format(parseISO(selectedSummary.date), "MMMM d, yyyy")}
                </span>
              </div>

              <div className="grid gap-6">
                {/* Podcast Player Card */}
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-display">
                      <Headphones className="h-5 w-5 text-primary" />
                      Listen to Podcast
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {/* Infographic */}
                    <img 
                      key={`infographic-${selectedSummary.date}`}
                      src={`https://storage.googleapis.com/daily_attention_infographic/all_infographics/${selectedSummary.date}.png`}
                      alt={`Infographic for ${format(parseISO(selectedSummary.date), "MMMM d, yyyy")}`}
                      className="w-full rounded-lg"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                      }}
                    />
                    
                    {/* Audio Player */}
                    <audio 
                      key={selectedSummary.date}
                      controls 
                      className="w-full"
                      preload="metadata"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const errorMsg = target.nextElementSibling as HTMLElement;
                        if (errorMsg) errorMsg.style.display = 'block';
                      }}
                    >
                      <source 
                        src={`https://storage.googleapis.com/daily_attention_podcasts/all_podcasts/${selectedSummary.date}.mp3`}
                        type="audio/mpeg" 
                      />
                      Your browser does not support the audio element.
                    </audio>
                    <p className="text-sm text-muted-foreground mt-2 hidden">
                      Podcast not available for this date.
                    </p>
                  </CardContent>
                </Card>

                {/* 1. Summary Card */}
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-display">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                      {selectedSummary.Summary}
                    </p>
                  </CardContent>
                </Card>

                {/* 2. Impact Card */}
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-display">
                      <Zap className="h-5 w-5 text-primary" />
                      Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedSummary.Impact}
                    </p>
                  </CardContent>
                </Card>

                {/* 3. Exciting Topics Card */}
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-display">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Exciting Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="grid gap-3">
                      {selectedSummary["Exciting Topics"].map((topic, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary ring-1 ring-primary/30 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground leading-relaxed">
                            {topic}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <div className="p-4 rounded-full bg-muted/20 mb-4">
                <CalendarIcon className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">Select a summary to view details</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
