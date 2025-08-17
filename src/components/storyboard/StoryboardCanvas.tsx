import { forwardRef } from "react";

interface StoryboardCanvasProps {
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  currentTool: 'select' | 'pen' | 'eraser';
  currentColor: string;
  onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const StoryboardCanvas = forwardRef<HTMLCanvasElement, StoryboardCanvasProps>(
  ({ isDrawing, setIsDrawing, currentTool, currentColor, onClick, onMouseDown, onMouseMove, onMouseUp }, ref) => {
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      onMouseDown?.(e);
      
      if (currentTool === 'pen' || currentTool === 'eraser') {
        const canvas = ref as React.RefObject<HTMLCanvasElement>;
        if (!canvas.current) return;

        const rect = canvas.current.getBoundingClientRect();
        const scaleX = canvas.current.width / rect.width;
        const scaleY = canvas.current.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        setIsDrawing(true);
        
        const ctx = canvas.current.getContext('2d');
        if (!ctx) return;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        if (currentTool === 'pen') {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = currentColor;
        } else {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = 10;
        }

        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      onMouseMove?.(e);
      
      if (!isDrawing || (currentTool !== 'pen' && currentTool !== 'eraser')) return;
      
      const canvas = ref as React.RefObject<HTMLCanvasElement>;
      if (!canvas.current) return;

      const rect = canvas.current.getBoundingClientRect();
      const scaleX = canvas.current.width / rect.width;
      const scaleY = canvas.current.height / rect.height;
      
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      const ctx = canvas.current.getContext('2d');
      if (!ctx) return;

      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement>) => {
      if (e) onMouseUp?.(e);
      setIsDrawing(false);
    };

    return (
      <canvas
        ref={ref}
        width={1200}
        height={800}
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          maxWidth: "100%",
          height: "auto",
          cursor: currentTool === 'select' ? 'default' : 
                 currentTool === 'pen' ? 'crosshair' : 'crosshair'
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onClick={onClick}
      />
    );
  }
);