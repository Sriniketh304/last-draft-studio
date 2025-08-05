import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  onClick: () => void;
}

export const FeatureCard = ({ title, description, imageSrc, onClick }: FeatureCardProps) => {
  return (
    <div className="bg-gradient-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 shadow-card hover:shadow-glow group">
      <div className="aspect-square w-full mb-4 overflow-hidden rounded-lg">
        <img 
          src={imageSrc} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
      <Button 
        variant="hero" 
        className="w-full"
        onClick={onClick}
      >
        Start {title}
      </Button>
    </div>
  );
};