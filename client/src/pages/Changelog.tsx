import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { FileText } from "lucide-react";

// Sample changelog entries - you can easily update these
const changelogEntries = [
  {
    id: 1,
    content: `# December 30, 2025

## New Features
- Removed the bullshit fluff from podcast. No longer will you hear weird upselling

## Details
- Fixing the fluff was more of a prompt engineering one. There's some wish to change the voice perhaps using eleven labs but that may be for another day
- Gonna leave the infographic as is
- Might go on hiatus and work on another project
`
  },
  {
    id: 2,
    content: `# December 29, 2025

## New Features
- Added podcast and infographic

## Details
- It is what it sounds like, we now generate infographics per daily summary, and a short voice transcript (typically ~600 words/ 3-4min)
- For the podcast, we still stick within the gemini ecosystem, using gemini to seperately generate transcript and generate mp3 file
- Imagery is similiar, using nanobanana

## Tech stuff
- Both remains to be improved - podcast transcript not ideal, I'd personally like it to be more straightforward and less 'fluffly'.
- Imagery is not really, trying hard to prompt such that the structure of the infographic is more categorical and cites research - but may move beyond a prompt engineering problem
- I may choose to keep it that way to keep things simple and not run up my personal API costs, but already proved POC capability
`
  },
  {
    id: 3,
    content: `# December 23, 2025

## New Features
- Added Chat with Paper function
- Added markdown rendering abilities
- Added Changelog page to track project updates

## Details
- Chat with Paper is a really exciting feature I'm glad to push out. It works by running OCR on the paper PDF on extraction time.
- Per conversation, we pass the markdown we get from OCR into the system prompt. We use Gemini-2.0-flash-lite.
- In this method, we lose multimodal capabilities for key imagery like architecture diagrams, but it's quicker and cheaper for me to implement.

## Tech stuff
- Previously, we queried for paper's markdown every conversation message to rebuild history. Now we store it on the frontend and pass it to the backend.
- This takes the load of bigquery but puts the payload on the FE/BE server itself. We will see how that goes but its more efficient for me
`
  },
  {
    id: 4,
    content: `# December 21, 2025

## DailyTLDR feature added
- Gets a daily summary
- Optimize querying BigQuery. Instead of querying all papers at whole and storing in mem, we only query the latest day's paper, and query subsequent dates on select

## Details
- Just a simple landing page that summarizes key daily papers
`
  },
  {
    id: 5,
    content: `# December 18, 2025

## Attention Daily is live!
- Scrapes huggingface papers daily
- Gets GenAI quick summary per paper

## Details
- Kind of a simple side project for me to try out deploying CRON jobs for scraping, running GenAI functions on it, and rendering it on an application
- Main tech stack is React, Typescript, GCP, Python
- Deployed on Render (reddit said it's good, and its pretty seamless so far)

`
  }
];

export function Changelog() {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  Changelog
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Track all updates, improvements, and changes to Daily Attention
              </p>
            </div>

            {/* Changelog Entries */}
            <div className="space-y-6">
              {changelogEntries.map((entry, index) => (
                <Card 
                  key={entry.id}
                  className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <MarkdownRenderer 
                      content={entry.content}
                      className="prose prose-slate dark:prose-invert max-w-none"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
              <p>Stay tuned for more updates and improvements!</p>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
