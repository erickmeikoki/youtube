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
  Tabs,
  Tab,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import youtubeService from "../services/youtubeService";
import errorService from "../services/errorService";
import PageWrapper from "../components/PageWrapper";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const fetchVideos = async (tabIndex) => {
    try {
      setLoading(true);
      let fetchedVideos = [];
      let history;
      let response;
      let data;

      switch (tabIndex) {
        case 0: // Recent History
          history = await youtubeService.getWatchHistory();
          fetchedVideos = history.slice(0, 12); // Show last 12 videos
          break;
        case 1: // Category Recommendations
          fetchedVideos = await youtubeService.getRecommendations();
          break;
        case 2: // Trending
          response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&key=${
              import.meta.env.VITE_YOUTUBE_API_KEY
            }`
          );
          data = await response.json();
          fetchedVideos = data.items;
          break;
        default:
          fetchedVideos = await youtubeService.getRecommendations();
      }

      setVideos(fetchedVideos.map(youtubeService.processVideoData));
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError(errorService.handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(activeTab);
  }, [activeTab]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleRetry = () => {
    setError(null);
    fetchVideos(activeTab);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <PageWrapper
      title="Dashboard"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            icon={<HistoryIcon />}
            label="Recent History"
            iconPosition="start"
          />
          <Tab
            icon={<CategoryIcon />}
            label="Recommended"
            iconPosition="start"
          />
          <Tab icon={<TrendingIcon />} label="Trending" iconPosition="start" />
        </Tabs>
      </Box>

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

export default Dashboard;
