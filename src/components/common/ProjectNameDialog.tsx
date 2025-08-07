import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from "@mui/material";

interface ProjectNameDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (projectName: string) => void;
  title: string;
}

export const ProjectNameDialog = ({ open, onClose, onSave, title }: ProjectNameDialogProps) => {
  const [projectName, setProjectName] = useState("");

  const handleSave = () => {
    if (projectName.trim()) {
      onSave(projectName.trim());
      setProjectName("");
      onClose();
    }
  };

  const handleClose = () => {
    setProjectName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            label="Project Name"
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={!projectName.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};