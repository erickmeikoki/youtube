import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Paper, Container } from "@mui/material";
import { YouTube as YouTubeIcon } from "@mui/icons-material";
import authService from "../services/authService";
import PageWrapper from "../components/PageWrapper";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    const authUrl = authService.getAuthUrl();
    window.location.href = authUrl;
  };

  const from = location.state?.from?.pathname || "/";

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
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to YouTube App
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          paragraph
        >
          Sign in to access your YouTube history, get personalized
          recommendations, and more.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Sign in with YouTube
        </Button>
      </Paper>
    </PageWrapper>
  );
};

export default Login;
