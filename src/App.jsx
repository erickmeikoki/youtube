import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { createAppTheme } from "./theme";
import useAccessibility from "./hooks/useAccessibility";
import useAnalytics from "./hooks/useAnalytics";
import offlineService from "./services/offlineService";
import authService from "./services/authService";
import AccessibilitySettings from "./components/AccessibilitySettings";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Recommendations from "./pages/Recommendations";
import Analytics from "./pages/Analytics";
import PageWrapper from "./components/PageWrapper";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const location = useLocation();
  const { fontSize, highContrast, reducedMotion } = useAccessibility();
  const { trackPageView, trackUserEngagement } = useAnalytics(
    location.pathname
  );
  const [isOffline, setIsOffline] = useState(false);

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  // Track user engagement
  useEffect(() => {
    const handleScroll = () => {
      trackUserEngagement();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trackUserEngagement]);

  // Handle offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const theme = React.useMemo(
    () => createAppTheme(highContrast ? "dark" : "light"),
    [highContrast]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <Recommendations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <AccessibilitySettings />
      </Box>
      <Snackbar
        open={isOffline}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={null}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          You are currently offline. Some features may be limited.
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
