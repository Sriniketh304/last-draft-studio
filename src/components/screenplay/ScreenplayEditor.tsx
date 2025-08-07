import { useState, useEffect } from "react";
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
import jsPDF from "jspdf";

export const ScreenplayEditor = () => {
  const navigate = useNavigate();
  const [scriptContent, setScriptContent] = useState("");
  const [scriptTitle, setScriptTitle] = useState("Untitled Script");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    const savedProjectName = localStorage.getItem('screenplay_project_name');
    if (savedProjectName) {
      setScriptTitle(savedProjectName);
      localStorage.removeItem('screenplay_project_name');
    }
  }, []);

  const handleSave = () => {
    console.log("Saving script:", { title: scriptTitle, content: scriptContent });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const lineHeight = 5;
    let currentY = margin;

    // Set font
    doc.setFont("courier", "normal");
    doc.setFontSize(12);

    // Add title
    doc.setFontSize(16);
    doc.text(scriptTitle, pageWidth / 2, currentY, { align: "center" });
    currentY += lineHeight * 3;

    // Add content
    doc.setFontSize(12);
    const lines = scriptContent.split('\n');
    
    for (let line of lines) {
      if (currentY > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }
      
      // Handle long lines by splitting them
      const splitLines = doc.splitTextToSize(line || " ", pageWidth - 2 * margin);
      for (let splitLine of splitLines) {
        if (currentY > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.text(splitLine, margin, currentY);
        currentY += lineHeight;
      }
    }

    // Save the PDF
    const fileName = `${scriptTitle.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
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