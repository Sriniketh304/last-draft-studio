import { Button, Box } from "@mui/material";
import { Image, Download, Save } from "@mui/icons-material";

interface StoryboardToolbarProps {
  onImportImage: () => void;
  onExportPDF: () => void;
  onSave: () => void;
}

export const StoryboardToolbar = ({ 
  onImportImage, 
  onExportPDF, 
  onSave 
}: StoryboardToolbarProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button
        variant="contained"
        startIcon={<Image />}
        onClick={onImportImage}
        sx={{ textTransform: "none" }}
      >
        Import Image
      </Button>
      <Button
        variant="contained"
        startIcon={<Download />}
        onClick={onExportPDF}
        sx={{ textTransform: "none" }}
      >
        Export PDF
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Save />}
        onClick={onSave}
        sx={{ textTransform: "none" }}
      >
        Save
      </Button>
    </Box>
  );
};