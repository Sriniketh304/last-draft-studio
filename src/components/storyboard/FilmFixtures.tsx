import { useState } from "react";
import { 
  Button, 
  Menu, 
  MenuItem, 
  Box, 
  Typography 
} from "@mui/material";
import { 
  KeyboardArrowDown,
  Person,
  Videocam,
  Room,
  Lightbulb,
  FlashlightOn
} from "@mui/icons-material";

export interface Fixture {
  id: string;
  label: string;
  icon: React.ReactNode;
  defaultProps: {
    width: number;
    height: number;
    color: string;
  };
}

const fixtures: Fixture[] = [
  {
    id: 'actor',
    label: 'Actor',
    icon: <Person />,
    defaultProps: { width: 50, height: 80, color: '#ff6b6b' }
  },
  {
    id: 'camera',
    label: 'Camera',
    icon: <Videocam />,
    defaultProps: { width: 60, height: 40, color: '#4ecdc4' }
  },
  {
    id: 'room',
    label: 'Room',
    icon: <Room />,
    defaultProps: { width: 100, height: 80, color: '#45b7d1' }
  },
  {
    id: 'light',
    label: 'Light',
    icon: <Lightbulb />,
    defaultProps: { width: 30, height: 40, color: '#f9ca24' }
  },
  {
    id: 'fresnel',
    label: 'Fresnel Light',
    icon: <FlashlightOn />,
    defaultProps: { width: 40, height: 50, color: '#f0932b' }
  }
];

interface FilmFixturesProps {
  onFixtureSelect?: (fixture: Fixture) => void;
}

export const FilmFixtures = ({ onFixtureSelect }: FilmFixturesProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFixtureSelect = (fixture: Fixture) => {
    onFixtureSelect?.(fixture);
    handleClose();
  };

  const handleDragStart = (e: React.DragEvent, fixture: Fixture) => {
    e.dataTransfer.setData('fixture', JSON.stringify(fixture));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        sx={{ textTransform: "none" }}
      >
        Add Fixtures
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        {fixtures.map((fixture) => (
          <MenuItem
            key={fixture.id}
            draggable
            onDragStart={(e) => handleDragStart(e, fixture)}
            onClick={() => handleFixtureSelect(fixture)}
            sx={{ 
              cursor: 'grab',
              '&:active': { cursor: 'grabbing' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: fixture.defaultProps.color }}>
                {fixture.icon}
              </Box>
              <Typography>{fixture.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export { fixtures };