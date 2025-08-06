import { forwardRef } from "react";

interface StoryboardCanvasProps {
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  currentTool: 'pen' | 'eraser';
  currentColor: string;
}

export const StoryboardCanvas = forwardRef<HTMLCanvasElement, StoryboardCanvasProps>(
  ({ isDrawing, setIsDrawing, currentTool, currentColor }, ref) => {
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = ref as React.RefObject<HTMLCanvasElement>;
      if (!canvas.current) return;

      const rect = canvas.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setIsDrawing(true);
      
      const ctx = canvas.current.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      
      const canvas = ref as React.RefObject<HTMLCanvasElement>;
      if (!canvas.current) return;

      const rect = canvas.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvas.current.getContext('2d');
      if (!ctx) return;

      if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 2;
      }

      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    return (
      <canvas
        ref={ref}
        style={{ 
          border: "1px solid #ddd", 
          borderRadius: "4px", 
          cursor: "crosshair" 
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    );
  }
);