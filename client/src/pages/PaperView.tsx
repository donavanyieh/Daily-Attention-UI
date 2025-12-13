import { useRoute } from "wouter";
import { mockPapers } from "@/data/mockPapers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Share2, Download, ExternalLink, ThumbsUp, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { format, parseISO } from "date-fns";
import NotFound from "@/pages/not-found";

export function PaperView() {
  const [, params] = useRoute("/paper/:id");
  const id = params?.id;
  
  const paper = mockPapers.find(p => p.id === id);
  
  if (!paper) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Daily Feed
          </a>
        </Link>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {paper.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-muted-foreground">
                  {tag}
                </Badge>
              ))}
              <Badge variant="secondary" className="font-mono">
                {paper.id}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight">
              {paper.title}
            </h1>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Published {format(parseISO(paper.date), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <ThumbsUp className="h-4 w-4 text-primary" />
                <span>{paper.upvotes.toLocaleString()} upvotes</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 py-4">
            <Button size="lg" className="rounded-full px-8">
              <ExternalLink className="mr-2 h-4 w-4" /> View Paper
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button size="lg" variant="ghost" className="rounded-full">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
          
          <Separator />
          
          <div className="grid md:grid-cols-[1fr_300px] gap-12 pt-6">
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-display font-bold mb-3">Abstract</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {paper.abstract}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-display font-bold mb-4">Discussion</h3>
                <div className="rounded-xl border bg-muted/30 p-6 text-center space-y-3">
                  <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/50" />
                  <p className="text-muted-foreground">No comments yet. Be the first to discuss this paper!</p>
                  <Button variant="outline" size="sm">Start Discussion</Button>
                </div>
              </section>
            </div>
            
            <aside className="space-y-8">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Authors</h3>
                <ul className="space-y-3">
                  {paper.authors.map((author, i) => (
                    <li key={i} className="flex items-center gap-3 group cursor-pointer">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {author.charAt(0)}
                      </div>
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{author}</span>
                    </li>
                  ))}
                </ul>
              </section>
              
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Similar Papers</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="group cursor-pointer">
                      <h4 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                        Advances in Large Language Model Architectures
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Smith et al. • 2023
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
