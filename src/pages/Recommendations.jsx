import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from "@mui/material";
import { PlayArrow as PlayIcon } from "@mui/icons-material";
import youtubeService from "../services/youtubeService";
import errorService from "../services/errorService";
import PageWrapper from "../components/PageWrapper";

const Recommendations = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const recommendations =
        await youtubeService.getPersonalizedRecommendations();
      setVideos(recommendations.map(youtubeService.processVideoData));
    } catch (error) {
      console.error("Error fetching personalized recommendations:", error);
      setError(errorService.handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleRetry = () => {
    setError(null);
    fetchRecommendations();
  };

  return (
    <PageWrapper
      title="Personalized Recommendations"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleVideoClick(video.id)}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => handleVideoClick(video.id)}
                >
                  {video.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {video.channel}
                </Typography>
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <Chip
                    label={`${video.views || "0"} views`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              <Divider />
              <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
                <Button
                  startIcon={<PlayIcon />}
                  variant="contained"
                  color="primary"
                  onClick={() => handleVideoClick(video.id)}
                  fullWidth
                >
                  Watch Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageWrapper>
  );
};

export default Recommendations;
