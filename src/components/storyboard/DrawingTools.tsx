import { Button, ButtonGroup, Box, Typography } from "@mui/material";
import { Brush, Delete } from "@mui/icons-material";

interface DrawingToolsProps {
  currentTool: 'pen' | 'eraser';
  onToolChange: (tool: 'pen' | 'eraser') => void;
}

export const DrawingTools = ({ currentTool, onToolChange }: DrawingToolsProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="subtitle2" fontWeight="medium">
        Tools:
      </Typography>
      <ButtonGroup variant="outlined" size="small">
        <Button
          variant={currentTool === 'pen' ? 'contained' : 'outlined'}
          startIcon={<Brush />}
          onClick={() => onToolChange('pen')}
          sx={{ textTransform: "none" }}
        >
          Draw
        </Button>
        <Button
          variant={currentTool === 'eraser' ? 'contained' : 'outlined'}
          startIcon={<Delete />}
          onClick={() => onToolChange('eraser')}
          sx={{ textTransform: "none" }}
        >
          Eraser
        </Button>
      </ButtonGroup>
    </Box>
  );
};