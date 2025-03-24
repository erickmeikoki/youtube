const PREFERENCES_KEY = "user_preferences";

const defaultPreferences = {
  theme: "light",
  fontSize: 16,
  highContrast: false,
  reducedMotion: false,
  notifications: true,
  language: "en",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

const preferencesService = {
  getPreferences() {
    try {
      const savedPreferences = localStorage.getItem(PREFERENCES_KEY);
      return savedPreferences
        ? JSON.parse(savedPreferences)
        : defaultPreferences;
    } catch (error) {
      console.error("Error getting preferences:", error);
      return defaultPreferences;
    }
  },

  updatePreferences(preferences) {
    try {
      const currentPreferences = this.getPreferences();
      const updatedPreferences = {
        ...currentPreferences,
        ...preferences,
      };
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updatedPreferences));
      return updatedPreferences;
    } catch (error) {
      console.error("Error updating preferences:", error);
      return null;
    }
  },

  resetPreferences() {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(defaultPreferences));
      return defaultPreferences;
    } catch (error) {
      console.error("Error resetting preferences:", error);
      return null;
    }
  },

  getPreference(key) {
    const preferences = this.getPreferences();
    return preferences[key];
  },

  setPreference(key, value) {
    return this.updatePreferences({ [key]: value });
  },
};

export default preferencesService;
