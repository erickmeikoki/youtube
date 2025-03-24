import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import authService from "../services/authService";
import PageWrapper from "../components/PageWrapper";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
          console.error("Auth error:", error);
          navigate("/login");
          return;
        }

        if (!code) {
          console.error("No authorization code received");
          navigate("/login");
          return;
        }

        const token = await authService.getAccessToken(code);
        if (token) {
          navigate("/");
        } else {
          console.error("Failed to get access token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <PageWrapper maxWidth="sm">
      <Paper
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <CircularProgress />
        <Typography variant="h6" component="h2">
          Completing sign in...
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Please wait while we complete your authentication.
        </Typography>
      </Paper>
    </PageWrapper>
  );
};

export default AuthCallback;
