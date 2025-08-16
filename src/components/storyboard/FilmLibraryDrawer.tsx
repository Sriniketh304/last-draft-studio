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

const filmFixtures: FilmFixture[] = [
  // People
  {
    id: 'actor',
    name: 'Actor',
    category: 'People',
    icon: <Person />,
    defaultProps: { width: 50, height: 80, color: '#ff6b6b' },
    description: 'Main performer in the scene'
  },
  {
    id: 'extra',
    name: 'Background Actor',
    category: 'People',
    icon: <DirectionsRun />,
    defaultProps: { width: 45, height: 75, color: '#ff9999' },
    description: 'Background performer'
  },
  
  // Equipment
  {
    id: 'camera',
    name: 'Camera',
    category: 'Equipment',
    icon: <Videocam />,
    defaultProps: { width: 60, height: 40, color: '#4ecdc4' },
    description: 'Primary filming camera'
  },
  {
    id: 'camera-b',
    name: 'B-Camera',
    category: 'Equipment',
    icon: <Movie />,
    defaultProps: { width: 55, height: 35, color: '#45b7d1' },
    description: 'Secondary camera angle'
  },
  {
    id: 'microphone',
    name: 'Microphone',
    category: 'Equipment',
    icon: <Mic />,
    defaultProps: { width: 25, height: 60, color: '#2d3436' },
    description: 'Audio recording device'
  },
  
  // Lighting
  {
    id: 'key-light',
    name: 'Key Light',
    category: 'Lighting',
    icon: <Lightbulb />,
    defaultProps: { width: 30, height: 40, color: '#f9ca24' },
    description: 'Primary lighting source'
  },
  {
    id: 'fill-light',
    name: 'Fill Light',
    category: 'Lighting',
    icon: <FlashlightOn />,
    defaultProps: { width: 25, height: 35, color: '#f0932b' },
    description: 'Secondary lighting to reduce shadows'
  },
  {
    id: 'fresnel',
    name: 'Fresnel Light',
    category: 'Lighting',
    icon: <FlashlightOn />,
    defaultProps: { width: 40, height: 50, color: '#e17055' },
    description: 'Focused spotlight with adjustable beam'
  },
  
  // Set Elements
  {
    id: 'room',
    name: 'Room/Building',
    category: 'Set',
    icon: <Room />,
    defaultProps: { width: 100, height: 80, color: '#45b7d1' },
    description: 'Interior or exterior structure'
  },
  {
    id: 'chair',
    name: 'Chair',
    category: 'Set',
    icon: <Chair />,
    defaultProps: { width: 35, height: 40, color: '#8B4513' },
    description: 'Seating furniture'
  },
  {
    id: 'table',
    name: 'Table',
    category: 'Set',
    icon: <TableRestaurant />,
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