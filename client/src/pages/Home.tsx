import { mockPapers } from "@/data/mockPapers";
import { PaperCard } from "@/components/PaperCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import generatedImage from '@assets/generated_images/abstract_geometric_shapes_floating_in_light_space.png';

export function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-muted/30">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${generatedImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-20 text-center max-w-3xl">
          <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-xs font-medium backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="mr-1 h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">Daily curated machine learning papers</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            Stay ahead in <span className="text-primary">AI Research</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            Discover the most impactful papers from Hugging Face, arXiv, and top conferences. 
            Curated daily for researchers and engineers.
          </p>
          
          <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            <Button size="lg" className="rounded-full px-8 text-base font-medium">
              Browse Papers
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base font-medium bg-background/50 backdrop-blur-sm">
              Submit Paper
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="latest" className="w-full">
          <div className="flex items-center justify-between mb-8">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="latest" className="gap-2">
                <Clock className="h-4 w-4" /> Latest
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" /> Trending
              </TabsTrigger>
            </TabsList>
            
            <div className="hidden sm:block text-sm text-muted-foreground">
              Showing {mockPapers.length} papers for today
            </div>
          </div>
          
          <TabsContent value="latest" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPapers.map((paper, index) => (
                <PaperCard key={paper.id} paper={paper} index={index} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPapers
                .sort((a, b) => b.upvotes - a.upvotes)
                .map((paper, index) => (
                <PaperCard key={paper.id} paper={paper} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
