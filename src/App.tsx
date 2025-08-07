import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ProjectSelection } from "./pages/ProjectSelection";
import { ScreenplayEditor } from "./pages/ScreenplayEditor";
import { StoryboardEditor } from "./pages/StoryboardEditor";
import { ShotDivisionEditor } from "./pages/ShotDivisionEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/screenplay" element={<ProjectSelection />} />
          <Route path="/screenplay/editor" element={<ScreenplayEditor />} />
          <Route path="/storyboard" element={<ProjectSelection />} />
          <Route path="/storyboard/editor" element={<StoryboardEditor />} />
          <Route path="/shot-division" element={<ProjectSelection />} />
          <Route path="/shot-division/editor" element={<ShotDivisionEditor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
