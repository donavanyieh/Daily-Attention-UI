import { Paper } from "@/data/mockPapers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowUp, Share2, Bookmark } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface PaperCardProps {
  paper: Paper;
  index: number;
}

export function PaperCard({ paper, index }: PaperCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/paper/${paper.id}`}>
        <a className="block group h-full">
          <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 border-muted bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
            <CardHeader className="p-5 pb-2 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {paper.title}
                </h3>
                <Badge variant="secondary" className="font-mono text-xs shrink-0">
                  {paper.id}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {paper.authors.slice(0, 3).map((author, i) => (
                  <span key={i} className="hover:text-foreground transition-colors">
                    {author}{i < Math.min(paper.authors.length, 3) - 1 ? "," : paper.authors.length > 3 ? " et al." : ""}
                  </span>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="p-5 py-2 flex-grow">
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {paper.abstract}
              </p>
            </CardContent>
            
            <CardFooter className="p-5 pt-2 flex items-center justify-between border-t border-muted/50 bg-muted/20 mt-auto">
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>{format(parseISO(paper.date), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <ArrowUp className="h-3.5 w-3.5 text-primary" />
                  <span>{paper.upvotes.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </a>
      </Link>
    </motion.div>
  );
}
