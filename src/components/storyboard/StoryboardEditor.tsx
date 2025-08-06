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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    console.log("Exporting storyboard to PDF");
  };

  const saveStoryboard = () => {
    console.log("Saving storyboard");
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
              onClick={clearCanvas}
              sx={{ textTransform: "none" }}
            >
              Clear
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Canvas */}
      <Container sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Paper elevation={2} sx={{ p: 2, bgcolor: "white" }}>
          <StoryboardCanvas 
            ref={canvasRef}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            currentTool={currentTool}
            currentColor={currentColor}
          />
        </Paper>
      </Container>
    </Box>
  );
};