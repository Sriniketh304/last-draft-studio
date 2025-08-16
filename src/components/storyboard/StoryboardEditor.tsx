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

    // Draw all canvas items
    canvasItems.forEach(item => {
      ctx.fillStyle = item.color;
      ctx.fillRect(item.x, item.y, item.width, item.height);
      
      // Draw label
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, item.x + item.width / 2, item.y + item.height / 2);
    });
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
    const fixtureData = e.dataTransfer.getData('fixture');
    
    if (fixtureData) {
      const fixture: Fixture = JSON.parse(fixtureData);
      const rect = mainCanvasRef.current?.getBoundingClientRect();
      
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addFixtureToCanvas(fixture, x, y);
      }
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
              border: "2px solid #e0e0e0", 
              borderRadius: 1, 
              overflow: "hidden",
              display: "flex",
              justifyContent: "center"
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