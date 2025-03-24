import axios from "axios";

const CLIENT_ID = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5173/auth/callback";
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.force-ssl",
];

const authService = {
  getAuthUrl() {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.append("client_id", CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", SCOPES.join(" "));
    authUrl.searchParams.append("access_type", "offline");
    authUrl.searchParams.append("prompt", "consent");

    console.log("Generated auth URL:", authUrl.toString());
    return authUrl.toString();
  },

  async getAccessToken(code) {
    try {
      console.log("Getting access token with code:", code);
      console.log("Using client ID:", CLIENT_ID);
      console.log("Using redirect URI:", REDIRECT_URI);

      const tokenRequest = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      };

      console.log("Token request:", {
        ...tokenRequest,
        client_secret: "[REDACTED]",
      });

      const response = await axios.post(
        "https://oauth2.googleapis.com/token",
        tokenRequest
      );

      if (!response.data.access_token) {
        console.error("No access token in response:", response.data);
        throw new Error("No access token received");
      }

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem(
        "token_expiry",
        Date.now() + response.data.expires_in * 1000
      );

      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error getting access token:",
        error.response?.data || error
      );
      console.error("Error details:", {
        error: error.response?.data?.error,
        description: error.response?.data?.error_description,
      });
      throw error;
    }
  },

  async refreshAccessToken() {
    try {
      console.log("Refreshing access token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        console.error("No refresh token available");
        return null;
      }

      const response = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      });

      console.log("Refresh token response:", response.data);

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem(
          "token_expiry",
          Date.now() + response.data.expires_in * 1000
        );
        return response.data.access_token;
      }

      return null;
    } catch (error) {
      console.error("Error refreshing token:", error.response?.data || error);
      return null;
    }
  },

  getStoredAccessToken() {
    const token = localStorage.getItem("access_token");
    const expiry = localStorage.getItem("token_expiry");
    console.log("Getting stored access token:", !!token);

    if (!token || !expiry) {
      return null;
    }

    // If token is expired or about to expire in the next 5 minutes
    if (Date.now() >= parseInt(expiry) - 300000) {
      return null;
    }

    return token;
  },

  isAuthenticated() {
    const isAuth = !!this.getStoredAccessToken();
    console.log("Checking authentication:", isAuth);
    return isAuth;
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    console.log("Logged out successfully");
  },
};

export default authService;
