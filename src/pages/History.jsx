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
import {
  PlayArrow as PlayIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import youtubeService from "../services/youtubeService";
import errorService from "../services/errorService";
import PageWrapper from "../components/PageWrapper";

const History = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const history = await youtubeService.getWatchHistory();
      setVideos(history.map(youtubeService.processVideoData));
    } catch (error) {
      console.error("Error fetching history:", error);
      setError(errorService.handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleDelete = async (videoId) => {
    try {
      await youtubeService.removeFromHistory(videoId);
      setVideos((prev) => prev.filter((video) => video.id !== videoId));
    } catch (error) {
      console.error("Error deleting history item:", error);
      setError(errorService.handleApiError(error));
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchHistory();
  };

  return (
    <PageWrapper
      title="Watch History"
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
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                  onClick={() => handleDelete(video.id)}
                  size="small"
                >
                  <DeleteIcon sx={{ color: "white" }} />
                </IconButton>
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

export default History;
