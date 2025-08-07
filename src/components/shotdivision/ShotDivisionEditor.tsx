import { useState, useEffect } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  Button,
  IconButton
} from "@mui/material";
import { ArrowBack, Add, Save, Download, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ShotTable } from "./ShotTable";
import { RenameDialog } from "../common/RenameDialog";

export interface Shot {
  id: string;
  shotNumber: string;
  description: string;
  cameraAngle: string;
  duration: string;
  location: string;
  notes: string;
}

export const ShotDivisionEditor = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("Untitled Shot Division");
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [shots, setShots] = useState<Shot[]>([
    {
      id: "1",
      shotNumber: "1",
      description: "",
      cameraAngle: "",
      duration: "",
      location: "",
      notes: ""
    }
  ]);

  useEffect(() => {
    const savedProjectName = localStorage.getItem('shotdivision_project_name');
    if (savedProjectName) {
      setProjectName(savedProjectName);
      localStorage.removeItem('shotdivision_project_name');
    }
  }, []);

  const addShot = () => {
    const newShot: Shot = {
      id: Date.now().toString(),
      shotNumber: (shots.length + 1).toString(),
      description: "",
      cameraAngle: "",
      duration: "",
      location: "",
      notes: ""
    };
    setShots([...shots, newShot]);
  };

  const updateShot = (id: string, field: keyof Shot, value: string) => {
    setShots(shots.map(shot => 
      shot.id === id ? { ...shot, [field]: value } : shot
    ));
  };

  const deleteShot = (id: string) => {
    if (shots.length > 1) {
      setShots(shots.filter(shot => shot.id !== id));
    }
  };

  const handleSave = () => {
    console.log("Saving shot division:", { projectName, shots });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ projectName, shots, exportDate: new Date().toISOString() }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${projectName.replace(/\s+/g, '_')}_shot_division.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
              onClick={() => navigate('/shot-division')} 
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addShot}
              sx={{ textTransform: "none" }}
            >
              Add Shot
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExport}
              sx={{ textTransform: "none" }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{ textTransform: "none" }}
            >
              Save
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Shot Division Table */}
      <Container maxWidth={false} sx={{ p: 3 }}>
        <ShotTable 
          shots={shots}
          onUpdateShot={updateShot}
          onDeleteShot={deleteShot}
        />
      </Container>

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