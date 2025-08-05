import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Edit, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ScreenplayEditor = () => {
  const navigate = useNavigate();
  const [scriptContent, setScriptContent] = useState("");
  const [scriptTitle, setScriptTitle] = useState("Untitled Script");
  const [selectedFormat, setSelectedFormat] = useState("action");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const formatOptions = [
    { value: "act", label: "Act" },
    { value: "scene", label: "Scene Heading" },
    { value: "action", label: "Action" },
    { value: "character", label: "Character" },
    { value: "dialogue", label: "Dialogue" },
    { value: "transition", label: "Transition" },
    { value: "shot", label: "Shot" },
  ];

  const handleSave = () => {
    // TODO: Implement save functionality with backend
    console.log("Saving script:", { title: scriptTitle, content: scriptContent });
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Exporting to PDF");
  };

  const handleImportPDF = () => {
    // TODO: Implement PDF import
    console.log("Importing from PDF");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/screenplay')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            {isEditingTitle ? (
              <input
                type="text"
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                className="bg-transparent text-xl font-semibold text-foreground border-b border-primary focus:outline-none"
                autoFocus
              />
            ) : (
              <h1 
                className="text-xl font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsEditingTitle(true)}
              >
                {scriptTitle}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* File Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="cinematic">
                  <FileText className="h-4 w-4" />
                  File
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Import PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Rename Script
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex max-w-7xl mx-auto">

        {/* Script Editor */}
        <div className="flex-1 p-6 max-w-none">
          <div className="bg-white rounded-lg shadow-card min-h-[800px] p-8">
            <textarea
              value={scriptContent}
              onChange={(e) => setScriptContent(e.target.value)}
              placeholder="Start writing your screenplay here..."
              className="w-full h-full min-h-[700px] resize-none border-none outline-none text-black font-mono text-sm leading-relaxed"
              style={{ fontFamily: 'Courier New, monospace' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};