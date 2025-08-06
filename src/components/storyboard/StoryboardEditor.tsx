import { useRef, useEffect, useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Paper, 
  Box,
  Button
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { StoryboardToolbar } from "./StoryboardToolbar";
import { StoryboardCanvas } from "./StoryboardCanvas";
import { DrawingTools } from "./DrawingTools";
import { ColorPalette } from "./ColorPalette";

export const StoryboardEditor = () => {
  const navigate = useNavigate();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [storyboardPanels, setStoryboardPanels] = useState<Array<{ id: number; canvasRef: React.RefObject<HTMLCanvasElement> }>>([
    { id: 1, canvasRef: useRef<HTMLCanvasElement>(null) },
    { id: 2, canvasRef: useRef<HTMLCanvasElement>(null) },
    { id: 3, canvasRef: useRef<HTMLCanvasElement>(null) },
    { id: 4, canvasRef: useRef<HTMLCanvasElement>(null) }
  ]);

  useEffect(() => {
    storyboardPanels.forEach(panel => {
      const canvas = panel.canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 400;
      canvas.height = 300;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  }, [storyboardPanels]);

  const clearCanvas = (panelId?: number) => {
    if (panelId) {
      const panel = storyboardPanels.find(p => p.id === panelId);
      const canvas = panel?.canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Clear all panels
      storyboardPanels.forEach(panel => {
        const canvas = panel.canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
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
          // Import to first panel for now
          const canvas = storyboardPanels[0]?.canvasRef.current;
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

  const addNewPanel = () => {
    const newId = Math.max(...storyboardPanels.map(p => p.id)) + 1;
    setStoryboardPanels(prev => [...prev, { id: newId, canvasRef: useRef<HTMLCanvasElement>(null) }]);
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
            <Typography variant="h6">
              Storyboard Editor
            </Typography>
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

            <Button 
              variant="contained" 
              color="error" 
              onClick={() => clearCanvas()}
              sx={{ textTransform: "none" }}
            >
              Clear All
            </Button>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={addNewPanel}
              sx={{ textTransform: "none" }}
            >
              Add Panel
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Storyboard Panels */}
      <Container sx={{ p: 3 }}>
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", 
          gap: 3,
          justifyItems: "center"
        }}>
          {storyboardPanels.map((panel, index) => (
            <Paper key={panel.id} elevation={2} sx={{ p: 2, bgcolor: "white", position: "relative" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Panel {index + 1}
                </Typography>
                <Button 
                  size="small" 
                  color="error" 
                  onClick={() => clearCanvas(panel.id)}
                  sx={{ textTransform: "none", minWidth: "auto", px: 1 }}
                >
                  Clear
                </Button>
              </Box>
              <Box sx={{ border: "2px solid #e0e0e0", borderRadius: 1, overflow: "hidden" }}>
                <StoryboardCanvas 
                  ref={panel.canvasRef}
                  isDrawing={isDrawing}
                  setIsDrawing={setIsDrawing}
                  currentTool={currentTool}
                  currentColor={currentColor}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};