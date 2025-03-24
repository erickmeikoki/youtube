const STORAGE_KEY = "youtube_analytics";

const analyticsService = {
  // Initialize analytics data structure
  initializeAnalytics() {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) {
      const initialData = {
        dailyUsage: [],
        totalWatchTime: 0,
        totalVideos: 0,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(existingData);
  },

  // Get all analytics data
  getAnalytics() {
    return this.initializeAnalytics();
  },

  // Update daily usage
  updateDailyUsage(watchTime, videosWatched = 1) {
    const analytics = this.getAnalytics();
    const today = new Date().toISOString().split("T")[0];

    // Find today's entry
    const todayEntry = analytics.dailyUsage.find(
      (entry) => entry.date === today
    );

    if (todayEntry) {
      // Update existing entry
      todayEntry.watchTime += watchTime;
      todayEntry.videosWatched += videosWatched;
    } else {
      // Create new entry
      analytics.dailyUsage.push({
        date: today,
        watchTime,
        videosWatched,
      });
    }

    // Update totals
    analytics.totalWatchTime += watchTime;
    analytics.totalVideos += videosWatched;
    analytics.lastUpdated = new Date().toISOString();

    // Keep only last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    analytics.dailyUsage = analytics.dailyUsage.filter(
      (entry) => new Date(entry.date) >= thirtyDaysAgo
    );

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics));
    return analytics;
  },

  // Reset analytics data
  resetAnalytics() {
    const initialData = {
      dailyUsage: [],
      totalWatchTime: 0,
      totalVideos: 0,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  },

  // Get analytics for a specific date range
  getAnalyticsForDateRange(startDate, endDate) {
    const analytics = this.getAnalytics();
    return analytics.dailyUsage.filter(
      (entry) =>
        new Date(entry.date) >= new Date(startDate) &&
        new Date(entry.date) <= new Date(endDate)
    );
  },

  // Get total watch time for a specific date range
  getTotalWatchTimeForDateRange(startDate, endDate) {
    const rangeData = this.getAnalyticsForDateRange(startDate, endDate);
    return rangeData.reduce((sum, day) => sum + day.watchTime, 0);
  },

  // Get total videos watched for a specific date range
  getTotalVideosForDateRange(startDate, endDate) {
    const rangeData = this.getAnalyticsForDateRange(startDate, endDate);
    return rangeData.reduce((sum, day) => sum + day.videosWatched, 0);
  },
};

export default analyticsService;
