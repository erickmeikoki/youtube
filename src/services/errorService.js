const errorService = {
  handleApiError(error) {
    console.error("API Error:", error);

    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 401:
          return "Authentication failed. Please log in again.";
        case 403:
          return "You do not have permission to access this resource.";
        case 404:
          return "The requested resource was not found.";
        case 429:
          return "Too many requests. Please try again later.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return (
            error.response.data?.error?.message ||
            "An error occurred. Please try again."
          );
      }
    } else if (error.request) {
      // Request made but no response
      return "Network error. Please check your connection.";
    } else {
      // Something else went wrong
      return "An unexpected error occurred. Please try again.";
    }
  },

  isAuthError(error) {
    return error.response?.status === 401;
  },

  isNetworkError(error) {
    return !error.response && error.request;
  },

  logError(error, context = "") {
    const errorLog = {
      timestamp: new Date().toISOString(),
      context,
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    };

    // Store error logs in localStorage
    const logs = JSON.parse(localStorage.getItem("error_logs") || "[]");
    logs.push(errorLog);
    localStorage.setItem("error_logs", JSON.stringify(logs.slice(-50))); // Keep last 50 errors
  },
};

export default errorService;
