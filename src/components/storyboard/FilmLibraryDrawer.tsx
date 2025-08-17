import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip
} from "@mui/material";
import {
  Search,
  Close,
  Add,
  SwapHoriz,
  Person,
  Videocam,
  Room,
  Lightbulb,
  FlashlightOn,
  Movie,
  Mic,
  DirectionsRun,
  Chair,
  TableRestaurant
} from "@mui/icons-material";

// Simple debounce hook implementation
function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
}

export interface FilmFixture {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  defaultProps: {
    width: number;
    height: number;
    color: string;
  };
  description: string;
}

// Simple line-based fixture icons matching reference style
const ActorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="6" r="3"/>
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="9" width="18" height="8" rx="2"/>
    <circle cx="12" cy="13" r="2"/>
    <path d="M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
  </svg>
);

const LightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="11" r="4"/>
    <path d="M12 2v4"/>
    <path d="M12 18v4"/>
    <path d="M6.93 6.93l2.83 2.83"/>
    <path d="M14.24 14.24l2.83 2.83"/>
    <path d="M2 12h4"/>
    <path d="M18 12h4"/>
    <path d="M6.93 17.07l2.83-2.83"/>
    <path d="M14.24 9.76l2.83-2.83"/>
  </svg>
);

const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="2" width="6" height="12" rx="3"/>
    <path d="M5 10v2a7 7 0 0 0 14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const RoomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="8" width="18" height="12"/>
    <path d="M3 8l9-6 9 6"/>
    <path d="M9 22V12h6v10"/>
  </svg>
);

const ChairIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="7" y="4" width="10" height="8"/>
    <path d="M7 12v8"/>
    <path d="M17 12v8"/>
    <path d="M7 8H5"/>
    <path d="M19 8h-2"/>
  </svg>
);

const TableIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="6" width="16" height="4"/>
    <path d="M6 10v8"/>
    <path d="M18 10v8"/>
  </svg>
);

const FresnelIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="8" width="12" height="6" rx="1"/>
    <circle cx="18" cy="11" r="2"/>
    <path d="M6 11H4"/>
    <path d="M12 14v6"/>
    <path d="M8 20h8"/>
  </svg>
);

const filmFixtures: FilmFixture[] = [
  // People
  {
    id: 'actor',
    name: 'Actor',
    category: 'People',
    icon: <ActorIcon />,
    defaultProps: { width: 50, height: 80, color: '#000000' },
    description: 'Main performer in the scene'
  },
  {
    id: 'extra',
    name: 'Background Actor',
    category: 'People',
    icon: <ActorIcon />,
    defaultProps: { width: 45, height: 75, color: '#666666' },
    description: 'Background performer'
  },
  
  // Equipment
  {
    id: 'camera',
    name: 'Camera',
    category: 'Equipment',
    icon: <CameraIcon />,
    defaultProps: { width: 60, height: 40, color: '#000000' },
    description: 'Primary filming camera'
  },
  {
    id: 'camera-b',
    name: 'B-Camera',
    category: 'Equipment',
    icon: <CameraIcon />,
    defaultProps: { width: 55, height: 35, color: '#666666' },
    description: 'Secondary camera angle'
  },
  {
    id: 'microphone',
    name: 'Microphone',
    category: 'Equipment',
    icon: <MicIcon />,
    defaultProps: { width: 25, height: 60, color: '#000000' },
    description: 'Audio recording device'
  },
  
  // Lighting
  {
    id: 'key-light',
    name: 'Key Light',
    category: 'Lighting',
    icon: <LightIcon />,
    defaultProps: { width: 30, height: 40, color: '#2196F3' },
    description: 'Primary lighting source'
  },
  {
    id: 'fill-light',
    name: 'Fill Light',
    category: 'Lighting',
    icon: <LightIcon />,
    defaultProps: { width: 25, height: 35, color: '#2196F3' },
    description: 'Secondary lighting to reduce shadows'
  },
  {
    id: 'fresnel',
    name: 'Fresnel Light',
    category: 'Lighting',
    icon: <FresnelIcon />,
    defaultProps: { width: 40, height: 50, color: '#2196F3' },
    description: 'Focused spotlight with adjustable beam'
  },
  
  // Set Elements
  {
    id: 'room',
    name: 'Room/Building',
    category: 'Set',
    icon: <RoomIcon />,
    defaultProps: { width: 100, height: 80, color: '#000000' },
    description: 'Interior or exterior structure'
  },
  {
    id: 'chair',
    name: 'Chair',
    category: 'Set',
    icon: <ChairIcon />,
    defaultProps: { width: 35, height: 40, color: '#8B4513' },
    description: 'Seating furniture'
  },
  {
    id: 'table',
    name: 'Table',
    category: 'Set',
    icon: <TableIcon />,
    defaultProps: { width: 60, height: 40, color: '#D2691E' },
    description: 'Table furniture'
  }
];

const categories = ['All', 'People', 'Equipment', 'Lighting', 'Set'];

interface FilmLibraryDrawerProps {
  open: boolean;
  onClose: () => void;
  onAddFixture: (fixture: FilmFixture) => void;
  onDragStart?: (e: React.DragEvent, fixture: FilmFixture) => void;
  selectedFixture?: FilmFixture | null;
  onFixtureSelect: (fixture: FilmFixture) => void;
}

export const FilmLibraryDrawer = ({
  open,
  onClose,
  onAddFixture,
  onDragStart,
  selectedFixture,
  onFixtureSelect
}: FilmLibraryDrawerProps) => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [debouncedSearchText] = useDebounce(searchText, 300);

  const filteredFixtures = filmFixtures.filter(fixture => {
    const matchesSearch = fixture.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
                         fixture.description.toLowerCase().includes(debouncedSearchText.toLowerCase());
    const matchesCategory = selectedCategory === "All" || fixture.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, fixture: FilmFixture) => {
    e.dataTransfer.setData('fixture', JSON.stringify(fixture));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create visual drag preview
    const dragImage = document.createElement('div');
    dragImage.style.padding = '8px 12px';
    dragImage.style.backgroundColor = fixture.defaultProps.color;
    dragImage.style.color = 'white';
    dragImage.style.borderRadius = '6px';
    dragImage.style.fontSize = '14px';
    dragImage.style.fontWeight = 'bold';
    dragImage.innerHTML = fixture.name;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);

    onDragStart?.(e, fixture);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 350,
          padding: 2,
          backgroundColor: '#fafafa'
        }
      }}
    >
      <Stack spacing={2}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Film Fixtures Library
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Search */}
        <TextField
          variant="outlined"
          placeholder="Search fixtures..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchText("")} size="small">
                  <Close />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Category Filter */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Categories
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                variant={selectedCategory === category ? "filled" : "outlined"}
                color={selectedCategory === category ? "primary" : "default"}
                size="small"
                onClick={() => setSelectedCategory(category)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Fixtures List */}
        <Box sx={{ flex: 1, overflow: 'auto', maxHeight: '60vh' }}>
          {filteredFixtures.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              No fixtures found matching your search
            </Typography>
          ) : (
            <List dense>
              {filteredFixtures.map((fixture) => (
                <ListItem
                  key={fixture.id}
                  disablePadding
                  sx={{
                    mb: 1,
                    border: selectedFixture?.id === fixture.id ? 2 : 1,
                    borderColor: selectedFixture?.id === fixture.id ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    backgroundColor: selectedFixture?.id === fixture.id ? 'action.selected' : 'background.paper'
                  }}
                >
                  <ListItemButton
                    draggable
                    onDragStart={(e) => handleDragStart(e, fixture)}
                    onClick={() => onFixtureSelect(fixture)}
                    sx={{
                      cursor: 'grab',
                      '&:active': { cursor: 'grabbing' },
                      borderRadius: 1
                    }}
                  >
                    <ListItemIcon sx={{ color: fixture.defaultProps.color, minWidth: 40 }}>
                      {fixture.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={fixture.name}
                      secondary={fixture.description}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                    <Chip
                      label={fixture.category}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Divider />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => selectedFixture && onAddFixture(selectedFixture)}
            disabled={!selectedFixture}
            fullWidth
          >
            Add to Canvas
          </Button>
        </Stack>

        {/* Instructions */}
        <Box sx={{ backgroundColor: 'info.light', p: 1.5, borderRadius: 1 }}>
          <Typography variant="caption" color="info.contrastText">
            💡 <strong>Tip:</strong> You can drag fixtures directly to the canvas or click to select and then use "Add to Canvas"
          </Typography>
        </Box>
      </Stack>
    </Drawer>
  );
};

export { filmFixtures };