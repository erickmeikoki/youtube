import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  Home as HomeIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <YouTubeIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            YouTube Analytics
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            startIcon={<HomeIcon />}
          >
            Dashboard
          </Button>
          <Button
            component={RouterLink}
            to="/history"
            color="inherit"
            startIcon={<HistoryIcon />}
          >
            History
          </Button>
          <Button
            component={RouterLink}
            to="/recommendations"
            color="inherit"
            startIcon={<TrendingUpIcon />}
          >
            Recommendations
          </Button>
          <Button
            component={RouterLink}
            to="/analytics"
            color="inherit"
            startIcon={<AnalyticsIcon />}
          >
            Analytics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
