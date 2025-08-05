import { useNavigate } from "react-router-dom";
import { FeatureCard } from "@/components/FeatureCard";
import heroImage from "@/assets/filmmaking-hero.jpg";
import screenplayIcon from "@/assets/screenplay-icon.jpg";
import storyboardIcon from "@/assets/storyboard-icon.jpg";
import shotdivisionIcon from "@/assets/shotdivision-icon.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Last Draft
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            The ultimate filmmaking companion for screenwriters, directors, and visual storytellers. 
            From screenplay to screen - bring your creative vision to life with professional-grade tools.
          </p>
          <div className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Whether you're crafting compelling dialogue, visualizing scenes through storyboards, 
            or planning every shot with precision, Last Draft provides the comprehensive suite 
            of tools that filmmakers trust to transform ideas into cinematic reality.
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Professional Filmmaking Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to plan, visualize, and execute your film projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Screenplay Writing"
              description="Professional screenplay formatting with industry-standard templates. Navigate through acts, scenes, and dialogue with ease. Export to PDF and collaborate seamlessly."
              imageSrc={screenplayIcon}
              onClick={() => navigate('/screenplay')}
            />
            
            <FeatureCard
              title="Storyboarding"
              description="Visual storytelling made simple. Create detailed storyboards with drawing tools, import images, and export your visual narrative to share with your team."
              imageSrc={storyboardIcon}
              onClick={() => navigate('/storyboard')}
            />
            
            <FeatureCard
              title="Shot Division"
              description="Plan every shot with precision. Organize camera angles, movements, and scene details in comprehensive shot lists that keep your production on track."
              imageSrc={shotdivisionIcon}
              onClick={() => navigate('/shotdivision')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
