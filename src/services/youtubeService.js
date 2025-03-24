import axios from "axios";
import authService from "./authService";
import cacheService from "./cacheService";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const youtubeService = {
  // Get user's watch history
  async getWatchHistory() {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error("Not authenticated");
      }

      // Check cache first
      const cachedHistory = cacheService.get("watch_history");
      if (cachedHistory) {
        console.log("Using cached watch history");
        return cachedHistory;
      }

      const accessToken = authService.getStoredAccessToken();
      if (!accessToken) {
        throw new Error("No access token available");
      }

      // First, get the user's watch history
      const historyResponse = await axios.get(`${BASE_URL}/activities`, {
        params: {
          part: "snippet,contentDetails",
          mine: true,
          key: API_KEY,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Extract video IDs from history
      const videoIds = historyResponse.data.items
        .filter((item) => item.contentDetails?.upload?.videoId)
        .map((item) => item.contentDetails.upload.videoId);

      if (!videoIds.length) {
        return [];
      }

      // Get detailed video information
      const videosResponse = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: "snippet,contentDetails,statistics",
          id: videoIds.join(","),
          key: API_KEY,
        },
      });

      const history = videosResponse.data.items;

      // Cache the results
      cacheService.set("watch_history", history);

      return history;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        try {
          const newToken = await authService.refreshAccessToken();
          if (newToken) {
            // Retry the request with the new token
            return this.getWatchHistory();
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
        }
      }
      console.error(
        "Error fetching watch history:",
        error.response?.data || error
      );
      throw error;
    }
  },

  // Get video details
  async getVideoDetails(videoId) {
    try {
      // Check cache first
      const cachedVideo = cacheService.get(`video_${videoId}`);
      if (cachedVideo) {
        console.log("Using cached video details");
        return cachedVideo;
      }

      const response = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: "snippet,contentDetails,statistics",
          id: videoId,
          key: API_KEY,
        },
      });

      const video = response.data.items[0];

      // Cache the results
      cacheService.set(`video_${videoId}`, video);

      return video;
    } catch (error) {
      console.error("Error fetching video details:", error);
      throw error;
    }
  },

  // Get recommended videos based on history
  async getRecommendations() {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error("Not authenticated");
      }

      // Check cache first
      const cachedRecommendations = cacheService.get("recommendations");
      if (cachedRecommendations) {
        console.log("Using cached recommendations");
        return cachedRecommendations;
      }

      const accessToken = authService.getStoredAccessToken();
      if (!accessToken) {
        throw new Error("No access token available");
      }

      // First, get the user's watch history to base recommendations on
      const history = await this.getWatchHistory();

      if (!history.length) {
        // If no history, return popular videos
        const response = await axios.get(`${BASE_URL}/videos`, {
          params: {
            part: "snippet,contentDetails,statistics",
            chart: "mostPopular",
            key: API_KEY,
          },
        });
        return response.data.items;
      }

      // Get video categories from history
      const categories = [
        ...new Set(history.map((video) => video.snippet.categoryId)),
      ];

      // Get videos from similar categories
      const recommendationsResponse = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: "snippet,contentDetails,statistics",
          chart: "mostPopular",
          videoCategoryId: categories[0], // Use the most common category
          key: API_KEY,
        },
      });

      // Filter out videos that are already in history
      const historyIds = new Set(history.map((video) => video.id));
      const recommendations = recommendationsResponse.data.items.filter(
        (video) => !historyIds.has(video.id)
      );

      // Cache the results
      cacheService.set("recommendations", recommendations);

      return recommendations;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      throw error;
    }
  },

  // Get personalized recommendations based on user's preferences
  async getPersonalizedRecommendations() {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error("Not authenticated");
      }

      // Check cache first
      const cachedRecommendations = cacheService.get(
        "personalized_recommendations"
      );
      if (cachedRecommendations) {
        console.log("Using cached personalized recommendations");
        return cachedRecommendations;
      }

      const accessToken = authService.getStoredAccessToken();
      if (!accessToken) {
        throw new Error("No access token available");
      }

      // Get user's watch history
      const history = await this.getWatchHistory();

      if (!history.length) {
        // If no history, return trending videos
        const response = await axios.get(`${BASE_URL}/videos`, {
          params: {
            part: "snippet,contentDetails,statistics",
            chart: "mostPopular",
            key: API_KEY,
          },
        });
        return response.data.items;
      }

      // Get video categories and their frequencies
      const categoryFreq = {};
      history.forEach((video) => {
        const categoryId = video.snippet.categoryId;
        categoryFreq[categoryId] = (categoryFreq[categoryId] || 0) + 1;
      });

      // Sort categories by frequency
      const sortedCategories = Object.entries(categoryFreq)
        .sort(([, a], [, b]) => b - a)
        .map(([categoryId]) => categoryId);

      // Get videos from top categories
      const recommendationsPromises = sortedCategories
        .slice(0, 3)
        .map((categoryId) =>
          axios.get(`${BASE_URL}/videos`, {
            params: {
              part: "snippet,contentDetails,statistics",
              chart: "mostPopular",
              videoCategoryId: categoryId,
              key: API_KEY,
            },
          })
        );

      const recommendationsResponses = await Promise.all(
        recommendationsPromises
      );
      const allVideos = recommendationsResponses.flatMap(
        (response) => response.data.items
      );

      // Filter out videos that are already in history
      const historyIds = new Set(history.map((video) => video.id));
      const recommendations = allVideos.filter(
        (video) => !historyIds.has(video.id)
      );

      // Sort by view count to get the most popular ones
      recommendations.sort(
        (a, b) =>
          parseInt(b.statistics.viewCount) - parseInt(a.statistics.viewCount)
      );

      // Take the top 30 videos
      const personalizedRecommendations = recommendations.slice(0, 30);

      // Cache the results
      cacheService.set(
        "personalized_recommendations",
        personalizedRecommendations
      );

      return personalizedRecommendations;
    } catch (error) {
      console.error("Error fetching personalized recommendations:", error);
      throw error;
    }
  },

  // Get video categories
  async getVideoCategories() {
    try {
      // Check cache first
      const cachedCategories = cacheService.get("categories");
      if (cachedCategories) {
        console.log("Using cached categories");
        return cachedCategories;
      }

      const response = await axios.get(`${BASE_URL}/videoCategories`, {
        params: {
          part: "snippet",
          regionCode: "US",
          key: API_KEY,
        },
      });

      const categories = response.data.items;

      // Cache the results
      cacheService.set("categories", categories);

      return categories;
    } catch (error) {
      console.error("Error fetching video categories:", error);
      throw error;
    }
  },

  // Process video data to extract relevant information
  processVideoData(video) {
    return {
      id: video.id,
      title: video.snippet.title,
      channel: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.medium.url,
      category: video.snippet.categoryId,
      duration: video.contentDetails.duration,
      views: video.statistics.viewCount,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
    };
  },

  // Clear all cached data
  clearCache() {
    cacheService.clear();
  },
};

export default youtubeService;
