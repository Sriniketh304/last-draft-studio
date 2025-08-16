import { useRef, useEffect, useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Paper, 
  Box,
  Button,
  IconButton
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { RenameDialog } from "../common/RenameDialog";
import { StoryboardToolbar } from "./StoryboardToolbar";
import { StoryboardCanvas } from "./StoryboardCanvas";
import { DrawingTools } from "./DrawingTools";
import { ColorPalette } from "./ColorPalette";
import { FilmFixtures, type Fixture } from "./FilmFixtures";

interface CanvasItem {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
}

export const StoryboardEditor = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("Untitled Storyboard");
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedProjectName = localStorage.getItem('storyboard_project_name');
    if (savedProjectName) {
      setProjectName(savedProjectName);
      localStorage.removeItem('storyboard_project_name');
    }
  }, []);

  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 800;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw all canvas items
    redrawCanvas();
  }, []);

  // Redraw canvas items when they change
  useEffect(() => {
    redrawCanvas();
  }, [canvasItems]);

  const redrawCanvas = () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all canvas items with SVG-style representations
    canvasItems.forEach(item => {
      drawFixtureIcon(ctx, item);
    });
  };

  const drawFixtureIcon = (ctx: CanvasRenderingContext2D, item: CanvasItem) => {
    const { x, y, width, height, type, color } = item;
    
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    switch (type) {
      case 'actor':
        // Draw a person shape
        // Head
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/4, width/6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Body
        ctx.beginPath();
        ctx.rect(x + width/3, y + height/3, width/3, height/2);
        ctx.fill();
        ctx.stroke();
        
        // Arms
        ctx.beginPath();
        ctx.rect(x + width/6, y + height/2.5, width/8, height/3);
        ctx.rect(x + width*0.75, y + height/2.5, width/8, height/3);
        ctx.fill();
        ctx.stroke();
        
        // Legs
        ctx.beginPath();
        ctx.rect(x + width/2.5, y + height*0.8, width/8, height/5);
        ctx.rect(x + width*0.6, y + height*0.8, width/8, height/5);
        ctx.fill();
        ctx.stroke();
        break;

      case 'camera':
        // Draw a camera shape
        // Main body
        ctx.beginPath();
        ctx.roundRect(x + width*0.1, y + height*0.3, width*0.8, height*0.5, 5);
        ctx.fill();
        ctx.stroke();
        
        // Lens
        ctx.beginPath();
        ctx.arc(x + width*0.3, y + height*0.55, width*0.15, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.stroke();
        
        // Viewfinder
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x + width*0.6, y + height*0.1, width*0.3, height*0.2);
        ctx.fill();
        ctx.stroke();
        break;

      case 'room':
        // Draw a room/building shape
        ctx.beginPath();
        ctx.rect(x, y + height*0.2, width, height*0.8);
        ctx.fill();
        ctx.stroke();
        
        // Roof
        ctx.beginPath();
        ctx.moveTo(x, y + height*0.2);
        ctx.lineTo(x + width/2, y);
        ctx.lineTo(x + width, y + height*0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Door
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.rect(x + width*0.4, y + height*0.6, width*0.2, height*0.4);
        ctx.fill();
        ctx.stroke();
        
        // Window
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.rect(x + width*0.15, y + height*0.35, width*0.2, width*0.15);
        ctx.fill();
        ctx.stroke();
        break;

      case 'light':
        // Draw a light bulb shape
        // Bulb
        ctx.beginPath();
        ctx.arc(x + width/2, y + height*0.4, width*0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Base
        ctx.beginPath();
        ctx.rect(x + width*0.35, y + height*0.65, width*0.3, height*0.2);
        ctx.fill();
        ctx.stroke();
        
        // Light rays
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const startX = x + width/2 + Math.cos(angle) * width*0.35;
          const startY = y + height*0.4 + Math.sin(angle) * width*0.35;
          const endX = x + width/2 + Math.cos(angle) * width*0.5;
          const endY = y + height*0.4 + Math.sin(angle) * width*0.5;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
        break;

      case 'fresnel':
        // Draw a fresnel light shape
        // Main body (cylindrical)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x + width*0.2, y + height*0.3, width*0.6, height*0.4);
        ctx.fill();
        ctx.stroke();
        
        // Lens (front circle)
        ctx.beginPath();
        ctx.arc(x + width*0.85, y + height*0.5, width*0.15, 0, Math.PI * 2);
        ctx.fillStyle = '#E6E6FA';
        ctx.fill();
        ctx.stroke();
        
        // Stand
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.rect(x + width*0.45, y + height*0.7, width*0.1, height*0.3);
        ctx.fill();
        ctx.stroke();
        
        // Base
        ctx.beginPath();
        ctx.rect(x + width*0.2, y + height*0.9, width*0.6, height*0.1);
        ctx.fill();
        ctx.stroke();
        break;

      default:
        // Fallback rectangle
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fill();
        ctx.stroke();
    }
    
    // Draw label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + width / 2, y + height + 15);
    
    ctx.restore();
  };

  const clearCanvas = () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setCanvasItems([]);
  };

  const addFixtureToCanvas = (fixture: Fixture, x: number = 100, y: number = 100) => {
    const newItem: CanvasItem = {
      id: `${fixture.id}-${Date.now()}`,
      type: fixture.id,
      x,
      y,
      width: fixture.defaultProps.width,
      height: fixture.defaultProps.height,
      color: fixture.defaultProps.color,
      label: fixture.label
    };
    
    setCanvasItems(prev => [...prev, newItem]);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const fixtureData = e.dataTransfer.getData('fixture');
    
    if (fixtureData) {
      try {
        const fixture: Fixture = JSON.parse(fixtureData);
        const canvas = mainCanvasRef.current;
        const rect = canvas?.getBoundingClientRect();
        
        if (rect && canvas) {
          // Calculate position relative to canvas, accounting for canvas scaling
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          
          const x = (e.clientX - rect.left) * scaleX;
          const y = (e.clientY - rect.top) * scaleY;
          
          addFixtureToCanvas(fixture, x, y);
        }
      } catch (error) {
        console.error('Error parsing fixture data:', error);
      }
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
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
          const canvas = mainCanvasRef.current;
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
    console.log("Exporting storyboard to PDF");
  };

  const saveStoryboard = () => {
    console.log("Saving storyboard");
  };

  const handleRename = (newName: string) => {
    setProjectName(newName);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <Box 
              onClick={() => navigate('/storyboard')} 
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <ArrowBack />
            </Box>
            <Typography variant="h6" sx={{ mr: 1 }}>
              {projectName}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => setRenameDialogOpen(true)}
              sx={{ ml: 1 }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Box>

          <StoryboardToolbar 
            onImportImage={importImage}
            onExportPDF={exportToPDF}
            onSave={saveStoryboard}
          />
        </Toolbar>
      </AppBar>

      {/* Tools */}
      <Paper elevation={1} sx={{ p: 2 }}>
        <Container maxWidth={false}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <DrawingTools 
              currentTool={currentTool}
              onToolChange={setCurrentTool}
            />
            
            <ColorPalette 
              currentColor={currentColor}
              onColorChange={setCurrentColor}
            />

            <FilmFixtures 
              onFixtureSelect={(fixture) => addFixtureToCanvas(fixture)}
            />

            <Button 
              variant="contained" 
              color="error" 
              onClick={() => clearCanvas()}
              sx={{ textTransform: "none" }}
            >
              Clear All
            </Button>
            
          </Box>
        </Container>
      </Paper>

      {/* Main Storyboard Canvas */}
      <Container sx={{ p: 3 }}>
        <Paper elevation={2} sx={{ p: 3, bgcolor: "white" }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Main Storyboard
          </Typography>
          <Box 
            sx={{ 
              border: "2px dashed #e0e0e0", 
              borderRadius: 1, 
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              minHeight: "500px",
              backgroundColor: "#fafafa",
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: '#f5f5f5'
              }
            }}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
          >
            <StoryboardCanvas 
              ref={mainCanvasRef}
              isDrawing={isDrawing}
              setIsDrawing={setIsDrawing}
              currentTool={currentTool}
              currentColor={currentColor}
            />
          </Box>
        </Paper>
      </Container>

      {/* Rename Dialog */}
      <RenameDialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        onRename={handleRename}
        currentName={projectName}
      />
    </Box>
  );
};