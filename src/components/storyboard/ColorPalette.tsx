import { Box, Typography, IconButton, Button, Popover } from "@mui/material";
import { Palette } from "@mui/icons-material";
import { useState } from "react";

interface ColorPaletteProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPalette = ({ currentColor, onColorChange }: ColorPaletteProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', 
    '#800080', '#FFC0CB', '#A52A2A', '#808080',
    '#FFFFFF', '#8B4513', '#00CED1', '#FFD700',
    '#FF69B4', '#32CD32', '#FF4500', '#9932CC'
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={<Palette />}
        onClick={handleClick}
        sx={{ 
          textTransform: "none",
          "& .MuiButton-startIcon": {
            color: currentColor
          }
        }}
      >
        Color Selection
      </Button>
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle2" fontWeight="medium" mb={2}>
            Choose Color:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {colors.map((color) => (
              <IconButton
                key={color}
                onClick={() => {
                  onColorChange(color);
                  handleClose();
                }}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: color,
                  border: currentColor === color ? "3px solid #1976d2" : "2px solid #ccc",
                  borderRadius: "50%",
                  minWidth: "unset",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Custom:</Typography>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => {
                onColorChange(e.target.value);
                handleClose();
              }}
              style={{
                width: "40px",
                height: "32px",
                borderRadius: "4px",
                border: "2px solid #ccc",
                cursor: "pointer",
                backgroundColor: "transparent"
              }}
              title="Custom color picker"
            />
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};