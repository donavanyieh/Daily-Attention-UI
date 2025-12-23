import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home } from "@/pages/Home";
import { DailyTLDR } from "@/pages/DailyTLDR";
import { ChatWithPaper } from "@/pages/ChatWithPaper";
import { Changelog } from "@/pages/Changelog";
import { Header } from "@/components/Header";

function Router() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <Switch>
        <Route path="/" component={DailyTLDR} />
        <Route path="/explore-papers" component={Home} />
        <Route path="/chat/:paperId" component={ChatWithPaper} />
        <Route path="/changelog" component={Changelog} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
