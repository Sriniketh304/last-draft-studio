import { Box, Button, Typography } from "@mui/material";
import { Edit, Clear, PanTool } from "@mui/icons-material";

interface DrawingToolsProps {
  currentTool: 'select' | 'pen' | 'eraser';
  onToolChange: (tool: 'select' | 'pen' | 'eraser') => void;
}

export const DrawingTools = ({ currentTool, onToolChange }: DrawingToolsProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" sx={{ mr: 1, fontWeight: "medium" }}>
        Tools:
      </Typography>
      
      <Button
        variant={currentTool === 'select' ? "contained" : "outlined"}
        size="small"
        onClick={() => onToolChange('select')}
        startIcon={<PanTool />}
        sx={{ 
          textTransform: "none",
          minWidth: "auto",
          bgcolor: currentTool === 'select' ? 'primary.main' : 'transparent',
          color: currentTool === 'select' ? 'white' : 'primary.main'
        }}
      >
        Select
      </Button>
      
      <Button
        variant={currentTool === 'pen' ? "contained" : "outlined"}
        size="small"
        onClick={() => onToolChange('pen')}
        startIcon={<Edit />}
        sx={{ 
          textTransform: "none",
          minWidth: "auto",
          bgcolor: currentTool === 'pen' ? 'primary.main' : 'transparent',
          color: currentTool === 'pen' ? 'white' : 'primary.main'
        }}
      >
        Draw
      </Button>

      <Button
        variant={currentTool === 'eraser' ? "contained" : "outlined"}
        size="small"
        onClick={() => onToolChange('eraser')}
        startIcon={<Clear />}
        sx={{ 
          textTransform: "none",
          minWidth: "auto",
          bgcolor: currentTool === 'eraser' ? 'primary.main' : 'transparent',
          color: currentTool === 'eraser' ? 'white' : 'primary.main'
        }}
      >
        Erase
      </Button>
    </Box>
  );
};