import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AccessTime as AccessTimeIcon,
  VideoLibrary as VideoLibraryIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import analyticsService from "../services/analyticsService";
import errorService from "../services/errorService";
import PageWrapper from "../components/PageWrapper";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyUsage, setDailyUsage] = useState([]);
  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [averageWatchTime, setAverageWatchTime] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const analytics = analyticsService.getAnalytics();

        // Process daily usage data for the last 7 days
        const last7Days = analytics.dailyUsage.slice(-7);
        setDailyUsage(last7Days);

        // Calculate total watch time
        const totalTime = last7Days.reduce(
          (sum, day) => sum + day.watchTime,
          0
        );
        setTotalWatchTime(totalTime);

        // Calculate total videos watched
        const totalVids = last7Days.reduce(
          (sum, day) => sum + day.videosWatched,
          0
        );
        setTotalVideos(totalVids);

        // Calculate average watch time per day
        const avgTime = totalTime / last7Days.length;
        setAverageWatchTime(avgTime);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError(errorService.handleApiError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleRetry = () => {
    setError(null);
    // Refresh analytics data
    window.location.reload();
  };

  return (
    <PageWrapper
      title="Analytics"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Total Watch Time</Typography>
              </Box>
              <Typography variant="h4">{formatTime(totalWatchTime)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <VideoLibraryIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Videos Watched</Typography>
              </Box>
              <Typography variant="h4">{totalVideos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Avg. Daily Watch Time</Typography>
              </Box>
              <Typography variant="h4">
                {formatTime(averageWatchTime)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Usage Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Daily Watch Time (Last 7 Days)
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                  />
                  <YAxis
                    tickFormatter={(value) => `${value}m`}
                    label={{
                      value: "Minutes",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    labelFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                    formatter={(value) => [`${value}m`, "Watch Time"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="watchTime"
                    stroke="#8884d8"
                    name="Watch Time"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default Analytics;
