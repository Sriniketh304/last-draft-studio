import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from "@mui/material";

interface RenameDialogProps {
  open: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

export const RenameDialog = ({ open, onClose, onRename, currentName }: RenameDialogProps) => {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (open) {
      setNewName(currentName);
    }
  }, [open, currentName]);

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== currentName) {
      onRename(newName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setNewName(currentName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rename Project</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            label="Project Name"
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleRename();
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleRename} 
          variant="contained" 
          disabled={!newName.trim() || newName.trim() === currentName}
        >
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};