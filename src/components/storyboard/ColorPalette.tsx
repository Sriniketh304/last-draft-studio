import { Box, Typography, IconButton } from "@mui/material";
import { Palette } from "@mui/icons-material";

interface ColorPaletteProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPalette = ({ currentColor, onColorChange }: ColorPaletteProps) => {
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', 
    '#800080', '#FFC0CB', '#A52A2A', '#808080',
    '#FFFFFF', '#8B4513', '#00CED1', '#FFD700',
    '#FF69B4', '#32CD32', '#FF4500', '#9932CC'
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="subtitle2" fontWeight="medium">
        Colors:
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {colors.map((color) => (
          <IconButton
            key={color}
            onClick={() => onColorChange(color)}
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
        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
          <Palette sx={{ mr: 1, color: "text.secondary" }} />
          <input
            type="color"
            value={currentColor}
            onChange={(e) => onColorChange(e.target.value)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "2px solid #ccc",
              cursor: "pointer",
              backgroundColor: "transparent"
            }}
            title="Custom color picker"
          />
        </Box>
      </Box>
    </Box>
  );
};