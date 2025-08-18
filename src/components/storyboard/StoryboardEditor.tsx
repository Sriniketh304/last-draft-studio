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
import { FilmLibraryDrawer, type FilmFixture } from "./FilmLibraryDrawer";

interface CanvasItem {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
  rotation: number;
  selected: boolean;
}

export const StoryboardEditor = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("Untitled Storyboard");
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'select' | 'pen' | 'eraser'>('select');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [libraryDrawerOpen, setLibraryDrawerOpen] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState<FilmFixture | null>(null);
  const [draggedItem, setDraggedItem] = useState<CanvasItem | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingItem, setResizingItem] = useState<CanvasItem | null>(null);
  const [resizeOffset, setResizeOffset] = useState({ x: 0, y: 0 });
  const [rotatingItem, setRotatingItem] = useState<CanvasItem | null>(null);
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
    const { x, y, width, height, type, color, rotation, selected } = item;
    
    ctx.save();
    
    // Apply rotation
    ctx.translate(x + width/2, y + height/2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-width/2, -height/2);
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // Draw simple line-based fixtures matching reference style
    switch (type) {
      case 'actor':
        // Simple person silhouette
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        
        // Head
        ctx.beginPath();
        ctx.arc(width/2, height/5, width/8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(width/2, height/5 + width/8);
        ctx.lineTo(width/2, height*0.7);
        ctx.stroke();
        
        // Arms
        ctx.beginPath();
        ctx.moveTo(width/3, height*0.4);
        ctx.lineTo(width*2/3, height*0.4);
        ctx.stroke();
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(width/2, height*0.7);
        ctx.lineTo(width/3, height*0.9);
        ctx.moveTo(width/2, height*0.7);
        ctx.lineTo(width*2/3, height*0.9);
        ctx.stroke();
        break;

      case 'camera':
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        
        // Camera body
        ctx.beginPath();
        ctx.rect(width*0.15, height*0.3, width*0.7, height*0.4);
        ctx.fill();
        ctx.stroke();
        
        // Lens
        ctx.beginPath();
        ctx.arc(width*0.3, height*0.5, width*0.1, 0, Math.PI * 2);
        ctx.stroke();
        
        // Viewfinder
        ctx.beginPath();
        ctx.rect(width*0.6, height*0.15, width*0.25, height*0.15);
        ctx.stroke();
        break;

      case 'room':
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        
        // Building body
        ctx.beginPath();
        ctx.rect(0, height*0.3, width, height*0.7);
        ctx.fill();
        ctx.stroke();
        
        // Roof
        ctx.beginPath();
        ctx.moveTo(0, height*0.3);
        ctx.lineTo(width/2, height*0.1);
        ctx.lineTo(width, height*0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Door
        ctx.beginPath();
        ctx.rect(width*0.4, height*0.6, width*0.2, height*0.4);
        ctx.stroke();
        break;

      case 'key-light':
      case 'fill-light':
      case 'light':
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        
        // Light bulb
        ctx.beginPath();
        ctx.arc(width/2, height*0.4, width*0.2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Light rays
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const startX = width/2 + Math.cos(angle) * width*0.25;
          const startY = height*0.4 + Math.sin(angle) * width*0.25;
          const endX = width/2 + Math.cos(angle) * width*0.35;
          const endY = height*0.4 + Math.sin(angle) * width*0.35;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
        
        // Base
        ctx.beginPath();
        ctx.moveTo(width/2, height*0.6);
        ctx.lineTo(width/2, height*0.8);
        ctx.stroke();
        break;

      case 'fresnel':
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        
        // Main body
        ctx.beginPath();
        ctx.rect(width*0.2, height*0.3, width*0.6, height*0.3);
        ctx.fill();
        ctx.stroke();
        
        // Lens
        ctx.beginPath();
        ctx.arc(width*0.8, height*0.45, width*0.1, 0, Math.PI * 2);
        ctx.stroke();
        
        // Stand
        ctx.beginPath();
        ctx.moveTo(width/2, height*0.6);
        ctx.lineTo(width/2, height*0.85);
        ctx.moveTo(width*0.3, height*0.85);
        ctx.lineTo(width*0.7, height*0.85);
        ctx.stroke();
        break;

      case 'microphone':
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        
        // Mic capsule
        ctx.beginPath();
        ctx.rect(width*0.4, height*0.1, width*0.2, height*0.4);
        ctx.fill();
        ctx.stroke();
        
        // Stand
        ctx.beginPath();
        ctx.moveTo(width/2, height*0.5);
        ctx.lineTo(width/2, height*0.8);
        ctx.moveTo(width*0.3, height*0.8);
        ctx.lineTo(width*0.7, height*0.8);
        ctx.stroke();
        break;

      case 'chair':
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        
        // Seat
        ctx.beginPath();
        ctx.rect(width*0.2, height*0.4, width*0.6, width*0.1);
        ctx.fill();
        ctx.stroke();
        
        // Back
        ctx.beginPath();
        ctx.rect(width*0.2, height*0.2, width*0.1, height*0.3);
        ctx.fill();
        ctx.stroke();
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(width*0.25, height*0.5);
        ctx.lineTo(width*0.25, height*0.8);
        ctx.moveTo(width*0.75, height*0.5);
        ctx.lineTo(width*0.75, height*0.8);
        ctx.stroke();
        break;

      case 'table':
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        
        // Table top
        ctx.beginPath();
        ctx.rect(width*0.1, height*0.3, width*0.8, height*0.1);
        ctx.fill();
        ctx.stroke();
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(width*0.2, height*0.4);
        ctx.lineTo(width*0.2, height*0.8);
        ctx.moveTo(width*0.8, height*0.4);
        ctx.lineTo(width*0.8, height*0.8);
        ctx.stroke();
        break;

      default:
        // Fallback rectangle
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fill();
        ctx.stroke();
    }
    
    // Draw selection border if selected
    if (selected) {
      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.rect(-5, -5, width + 10, height + 10);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw rotation handle
      ctx.fillStyle = '#2196F3';
      ctx.beginPath();
      ctx.arc(width/2, -15, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw resize handle (bottom-right corner)
      ctx.fillStyle = '#2196F3';
      ctx.beginPath();
      ctx.rect(width - 4, height - 4, 8, 8);
      ctx.fill();
    }
    
    ctx.restore();
    
    // Draw label below the item (not rotated)
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + width / 2, y + height + 15);
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

  const addFixtureToCanvas = (fixture: FilmFixture, x: number = 100, y: number = 100) => {
    const newItem: CanvasItem = {
      id: `${fixture.id}-${Date.now()}`,
      type: fixture.id,
      x,
      y,
      width: fixture.defaultProps.width,
      height: fixture.defaultProps.height,
      color: fixture.defaultProps.color,
      label: fixture.name,
      rotation: 0,
      selected: false
    };
    
    setCanvasItems(prev => [...prev, newItem]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'pen' || currentTool === 'eraser') return; // Don't handle clicks when drawing
    
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check if clicking on an item
    let clickedItem: CanvasItem | null = null;
    for (let i = canvasItems.length - 1; i >= 0; i--) {
      const item = canvasItems[i];
      if (clickX >= item.x && clickX <= item.x + item.width &&
          clickY >= item.y && clickY <= item.y + item.height) {
        clickedItem = item;
        break;
      }
    }

    // Update selection - clear all selections first, then select clicked item
    setCanvasItems(prev => prev.map(item => ({
      ...item,
      selected: item === clickedItem
    })));
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'pen' || currentTool === 'eraser') return; // Don't handle fixture interaction when drawing
    
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Check if clicking on an item
    for (let i = canvasItems.length - 1; i >= 0; i--) {
      const item = canvasItems[i];
      if (mouseX >= item.x && mouseX <= item.x + item.width &&
          mouseY >= item.y && mouseY <= item.y + item.height) {
        
        // Check if clicking on resize handles (only if item is selected)
        if (item.selected) {
          const resizeHandleSize = 8;
          
          // Bottom-right resize handle
          const resizeHandleX = item.x + item.width - resizeHandleSize / 2;
          const resizeHandleY = item.y + item.height - resizeHandleSize / 2;
          if (mouseX >= resizeHandleX && mouseX <= resizeHandleX + resizeHandleSize &&
              mouseY >= resizeHandleY && mouseY <= resizeHandleY + resizeHandleSize) {
            setResizingItem(item);
            setResizeOffset({
              x: mouseX - (item.x + item.width),
              y: mouseY - (item.y + item.height)
            });
            return;
          }
          
          // Rotation handle
          const centerX = item.x + item.width / 2;
          const handleY = item.y - 15;
          const distToHandle = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - handleY) ** 2);
          
          if (distToHandle <= 8) {
            setRotatingItem(item);
            return;
          }
        }
        
        // Select the item if not selected
        if (!item.selected) {
          setCanvasItems(prev => prev.map(i => ({
            ...i,
            selected: i.id === item.id
          })));
        }
        
        // Start dragging
        setDraggedItem(item);
        setDragOffset({
          x: mouseX - item.x,
          y: mouseY - item.y
        });
        break;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool !== 'select') return;
    
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Handle dragging
    if (draggedItem) {
      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;

      setCanvasItems(prev => prev.map(item => 
        item.id === draggedItem.id 
          ? { ...item, x: newX, y: newY }
          : item
      ));
    }
    
    // Handle resizing
    if (resizingItem) {
      const newWidth = Math.max(20, mouseX - resizingItem.x - resizeOffset.x);
      const newHeight = Math.max(20, mouseY - resizingItem.y - resizeOffset.y);

      setCanvasItems(prev => prev.map(item => 
        item.id === resizingItem.id 
          ? { ...item, width: newWidth, height: newHeight }
          : item
      ));
    }
    
    // Handle rotation
    if (rotatingItem) {
      const centerX = rotatingItem.x + rotatingItem.width / 2;
      const centerY = rotatingItem.y + rotatingItem.height / 2;
      const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
      const rotation = (angle * 180 / Math.PI + 90) % 360;

      setCanvasItems(prev => prev.map(item => 
        item.id === rotatingItem.id 
          ? { ...item, rotation: rotation }
          : item
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedItem(null);
    setResizingItem(null);
    setRotatingItem(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const selectedItem = canvasItems.find(item => item.selected);
    if (!selectedItem) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      setCanvasItems(prev => prev.filter(item => !item.selected));
    } else if (e.key === 'r' || e.key === 'R') {
      setCanvasItems(prev => prev.map(item => 
        item.selected 
          ? { ...item, rotation: (item.rotation + 15) % 360 }
          : item
      ));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvasItems]);

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const fixtureData = e.dataTransfer.getData('fixture');
    
    if (fixtureData) {
      try {
        const fixture: FilmFixture = JSON.parse(fixtureData);
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

            <Button 
              variant="contained" 
              onClick={() => setLibraryDrawerOpen(true)}
              sx={{ textTransform: "none" }}
            >
              Open Fixtures Library
            </Button>

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
              onClick={handleCanvasClick}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
            />
          </Box>
        </Paper>
      </Container>

      {/* Film Library Drawer */}
      <FilmLibraryDrawer
        open={libraryDrawerOpen}
        onClose={() => setLibraryDrawerOpen(false)}
        onAddFixture={(fixture) => addFixtureToCanvas(fixture)}
        selectedFixture={selectedFixture}
        onFixtureSelect={setSelectedFixture}
      />

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