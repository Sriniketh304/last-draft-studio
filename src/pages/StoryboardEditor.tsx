import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Save, Image, Pencil, Square, Circle, Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StoryboardEditor = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'shapes'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const addShape = (shape: 'rectangle' | 'circle' | 'triangle') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.globalCompositeOperation = 'source-over';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 50;

    switch (shape) {
      case 'rectangle':
        ctx.strokeRect(centerX - size, centerY - size, size * 2, size * 2);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX - size, centerY + size);
        ctx.lineTo(centerX + size, centerY + size);
        ctx.closePath();
        ctx.stroke();
        break;
    }
  };

  const importImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const exportToPDF = () => {
    // TODO: Implement PDF export functionality
    console.log("Exporting storyboard to PDF");
  };

  const saveStoryboard = () => {
    // TODO: Implement save functionality
    console.log("Saving storyboard");
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080'];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/storyboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Storyboard Editor</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="cinematic" onClick={importImage}>
              <Image className="h-4 w-4" />
              Import Image
            </Button>
            <Button variant="cinematic" onClick={exportToPDF}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="hero" onClick={saveStoryboard}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="border-b border-border bg-card/50 p-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          {/* Drawing Tools */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentTool === 'pen' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentTool('pen')}
            >
              <Pencil className="h-4 w-4" />
              Draw
            </Button>
            <Button
              variant={currentTool === 'eraser' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentTool('eraser')}
            >
              Eraser
            </Button>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground mr-2">Colors:</span>
            {colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  currentColor === color ? 'border-primary border-4' : 'border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
                title={`Select ${color}`}
              />
            ))}
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-8 h-8 rounded-full border-2 border-gray-400 cursor-pointer"
              title="Custom color picker"
            />
          </div>


          <Button variant="destructive" size="sm" onClick={clearCanvas}>
            Clear
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="p-6 flex justify-center">
        <div className="bg-white rounded-lg shadow-card p-4">
          <canvas
            ref={canvasRef}
            className="border border-border rounded cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
};