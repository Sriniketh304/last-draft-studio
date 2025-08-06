import { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  Button
} from "@mui/material";
import { ArrowBack, Add, Save, Download } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ShotTable } from "./ShotTable";

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
    console.log("Saving shot division:", shots);
  };

  const handleExport = () => {
    console.log("Exporting shot division");
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
            <Typography variant="h6">
              Shot Division Editor
            </Typography>
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
    </Box>
  );
};