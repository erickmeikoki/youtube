const CACHE_PREFIX = "offline_cache_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const offlineService = {
  async cacheData(key, data) {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
      };
      await localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheItem));
      return true;
    } catch (error) {
      console.error("Error caching data:", error);
      return false;
    }
  },

  async getCachedData(key) {
    try {
      const cacheItem = localStorage.getItem(CACHE_PREFIX + key);
      if (!cacheItem) return null;

      const { data, timestamp } = JSON.parse(cacheItem);
      if (Date.now() - timestamp > CACHE_DURATION) {
        this.removeCachedData(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error getting cached data:", error);
      return null;
    }
  },

  removeCachedData(key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  },

  clearCache() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  },

  isOnline() {
    return navigator.onLine;
  },

  setupOfflineListener(callback) {
    window.addEventListener("online", () => callback(true));
    window.addEventListener("offline", () => callback(false));
  },

  removeOfflineListener(callback) {
    window.removeEventListener("online", () => callback(true));
    window.removeEventListener("offline", () => callback(false));
  },
};

export default offlineService;
