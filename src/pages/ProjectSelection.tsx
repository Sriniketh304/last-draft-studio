import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const ProjectSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const projectType = location.pathname.split('/')[1]; // screenplay, storyboard, or shotdivision

  const getTitle = () => {
    switch (projectType) {
      case 'screenplay': return 'Screenplay Projects';
      case 'storyboard': return 'Storyboard Projects';
      case 'shotdivision': return 'Shot Division Projects';
      default: return 'Projects';
    }
  };

  const handleCreateNew = () => {
    navigate(`/${projectType}/editor`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{getTitle()}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create New Project */}
          <div 
            className="bg-gradient-card border border-border rounded-lg p-8 hover:border-primary/50 transition-all duration-300 shadow-card hover:shadow-glow cursor-pointer group"
            onClick={handleCreateNew}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Create New Project</h3>
              <p className="text-muted-foreground">Start a new {projectType} project from scratch</p>
            </div>
          </div>

          {/* Saved Projects */}
          <div className="bg-gradient-card border border-border rounded-lg p-8 hover:border-primary/50 transition-all duration-300 shadow-card hover:shadow-glow cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                <FileText className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Saved Projects</h3>
              <p className="text-muted-foreground">Access your previously saved {projectType} projects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};