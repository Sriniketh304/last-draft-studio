import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText 
} from "@mui/material";
import { 
  Description, 
  Download, 
  Edit, 
  Save 
} from "@mui/icons-material";
import { useState } from "react";

interface ScreenplayToolbarProps {
  onSave: () => void;
  onExportPDF: () => void;
  onImportPDF: () => void;
  onRename: () => void;
}

export const ScreenplayToolbar = ({ 
  onSave, 
  onExportPDF, 
  onImportPDF, 
  onRename 
}: ScreenplayToolbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Description />}
        onClick={handleClick}
        sx={{ textTransform: "none" }}
      >
        File
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuAction(onSave)}>
          <ListItemIcon>
            <Save fontSize="small" />
          </ListItemIcon>
          <ListItemText>Save Draft</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(onImportPDF)}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(onExportPDF)}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(onRename)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename Script</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};