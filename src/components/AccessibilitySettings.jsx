import React from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import {
  TextFields as TextFieldsIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import useAccessibility from "../hooks/useAccessibility";

const AccessibilitySettings = () => {
  const {
    fontSize,
    highContrast,
    reducedMotion,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleReducedMotion,
  } = useAccessibility();

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        p: 2,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Accessibility
      </Typography>
      <Divider sx={{ mb: 1 }} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Decrease font size">
          <IconButton
            onClick={decreaseFontSize}
            size="small"
            aria-label="Decrease font size"
          >
            <TextFieldsIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Typography variant="body2" sx={{ minWidth: 40, textAlign: "center" }}>
          {fontSize}px
        </Typography>

        <Tooltip title="Increase font size">
          <IconButton
            onClick={increaseFontSize}
            size="small"
            aria-label="Increase font size"
          >
            <TextFieldsIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Tooltip
        title={highContrast ? "Disable high contrast" : "Enable high contrast"}
      >
        <Button
          startIcon={<VisibilityIcon />}
          onClick={toggleHighContrast}
          variant={highContrast ? "contained" : "outlined"}
          size="small"
          aria-pressed={highContrast}
        >
          High Contrast
        </Button>
      </Tooltip>

      <Tooltip title={reducedMotion ? "Enable animations" : "Reduce motion"}>
        <Button
          startIcon={<SpeedIcon />}
          onClick={toggleReducedMotion}
          variant={reducedMotion ? "contained" : "outlined"}
          size="small"
          aria-pressed={reducedMotion}
        >
          Reduce Motion
        </Button>
      </Tooltip>
    </Paper>
  );
};

export default AccessibilitySettings;
