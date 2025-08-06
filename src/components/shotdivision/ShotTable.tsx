import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Box
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Shot } from "./ShotDivisionEditor";

interface ShotTableProps {
  shots: Shot[];
  onUpdateShot: (id: string, field: keyof Shot, value: string) => void;
  onDeleteShot: (id: string) => void;
}

export const ShotTable = ({ shots, onUpdateShot, onDeleteShot }: ShotTableProps) => {
  const columns = [
    { key: 'shotNumber' as keyof Shot, label: 'Shot #', width: '10%' },
    { key: 'description' as keyof Shot, label: 'Description', width: '25%' },
    { key: 'cameraAngle' as keyof Shot, label: 'Camera Angle', width: '15%' },
    { key: 'duration' as keyof Shot, label: 'Duration', width: '10%' },
    { key: 'location' as keyof Shot, label: 'Location', width: '15%' },
    { key: 'notes' as keyof Shot, label: 'Notes', width: '20%' },
  ];

  return (
    <TableContainer 
      component={Paper} 
      elevation={2}
      sx={{ 
        bgcolor: "white",
        border: "1px solid #e0e0e0"
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell 
                key={column.key}
                sx={{ 
                  fontWeight: "bold",
                  bgcolor: "#f5f5f5",
                  border: "1px solid #e0e0e0",
                  width: column.width
                }}
              >
                {column.label}
              </TableCell>
            ))}
            <TableCell 
              sx={{ 
                fontWeight: "bold",
                bgcolor: "#f5f5f5",
                border: "1px solid #e0e0e0",
                width: "5%"
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shots.map((shot) => (
            <TableRow key={shot.id} hover>
              {columns.map((column) => (
                <TableCell 
                  key={column.key}
                  sx={{ 
                    border: "1px solid #e0e0e0",
                    p: 0
                  }}
                >
                  <TextField
                    fullWidth
                    variant="standard"
                    value={shot[column.key]}
                    onChange={(e) => onUpdateShot(shot.id, column.key, e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        p: 1,
                        bgcolor: "white",
                        fontSize: "14px",
                        "&:hover": {
                          bgcolor: "#f9f9f9"
                        },
                        "&:focus-within": {
                          bgcolor: "#fff",
                          outline: "2px solid #1976d2"
                        }
                      }
                    }}
                    multiline={column.key === 'description' || column.key === 'notes'}
                    rows={column.key === 'description' || column.key === 'notes' ? 2 : 1}
                  />
                </TableCell>
              ))}
              <TableCell 
                sx={{ 
                  border: "1px solid #e0e0e0",
                  textAlign: "center"
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => onDeleteShot(shot.id)}
                  disabled={shots.length === 1}
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};