import { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Paper, 
  TextField,
  Box
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ScreenplayToolbar } from "./ScreenplayToolbar";

export const ScreenplayEditor = () => {
  const navigate = useNavigate();
  const [scriptContent, setScriptContent] = useState("");
  const [scriptTitle, setScriptTitle] = useState("Untitled Script");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleSave = () => {
    console.log("Saving script:", { title: scriptTitle, content: scriptContent });
  };

  const handleExportPDF = () => {
    console.log("Exporting to PDF");
  };

  const handleImportPDF = () => {
    console.log("Importing from PDF");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <Box 
              onClick={() => navigate('/screenplay')} 
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <ArrowBack />
            </Box>
            
            {isEditingTitle ? (
              <TextField
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                variant="standard"
                autoFocus
                sx={{ fontSize: "1.25rem", fontWeight: 600 }}
              />
            ) : (
              <Typography 
                variant="h6"
                sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
                onClick={() => setIsEditingTitle(true)}
              >
                {scriptTitle}
              </Typography>
            )}
          </Box>

          <ScreenplayToolbar 
            onSave={handleSave}
            onExportPDF={handleExportPDF}
            onImportPDF={handleImportPDF}
            onRename={() => setIsEditingTitle(true)}
          />
        </Toolbar>
      </AppBar>

      {/* Main Editor */}
      <Container maxWidth={false} sx={{ p: 3 }}>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            minHeight: "800px",
            bgcolor: "white"
          }}
        >
          <TextField
            multiline
            fullWidth
            value={scriptContent}
            onChange={(e) => setScriptContent(e.target.value)}
            placeholder="Start writing your screenplay here..."
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
                lineHeight: 1.6,
                minHeight: "700px",
                color: "black",
                alignItems: "flex-start",
                "& textarea": {
                  textAlign: "left"
                }
              }
            }}
            sx={{
              "& .MuiInputBase-root": {
                alignItems: "flex-start"
              }
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
};