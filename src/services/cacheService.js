const CACHE_PREFIX = "youtube_analytics_";
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cacheService = {
  set(key, value, duration = DEFAULT_CACHE_DURATION) {
    const item = {
      value,
      timestamp: Date.now(),
      duration,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  },

  get(key) {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    const { value, timestamp, duration } = JSON.parse(item);
    if (Date.now() - timestamp > duration) {
      this.remove(key);
      return null;
    }

    return value;
  },

  remove(key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  },

  clear() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  },
};

export default cacheService;
