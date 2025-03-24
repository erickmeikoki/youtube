import { useEffect } from "react";
import analyticsService from "../services/analyticsService";

const useAnalytics = (pageName) => {
  useEffect(() => {
    // Track page view
    console.log(`Page viewed: ${pageName}`);

    // Track user session
    const sessionStart = localStorage.getItem("session_start");
    if (!sessionStart) {
      localStorage.setItem("session_start", Date.now());
    }

    // Track user engagement
    const trackUserEngagement = () => {
      const engagement = {
        timestamp: Date.now(),
        page: pageName,
        action: "user_engagement",
      };

      // Store engagement data
      const engagements = JSON.parse(
        localStorage.getItem("user_engagements") || "[]"
      );
      engagements.push(engagement);
      localStorage.setItem("user_engagements", JSON.stringify(engagements));
    };

    // Track user interactions
    const handleInteraction = (event) => {
      const interaction = {
        timestamp: Date.now(),
        page: pageName,
        action: event.type,
        target: event.target.tagName,
        id: event.target.id,
        class: event.target.className,
      };

      // Store interaction data
      const interactions = JSON.parse(
        localStorage.getItem("user_interactions") || "[]"
      );
      interactions.push(interaction);
      localStorage.setItem("user_interactions", JSON.stringify(interactions));
    };

    // Add event listeners
    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("scroll", trackUserEngagement);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("scroll", trackUserEngagement);
    };
  }, [pageName]);

  // Return tracking functions
  return {
    trackPageView: (page) => {
      console.log(`Page viewed: ${page}`);
      const pageView = {
        timestamp: Date.now(),
        page,
      };
      const pageViews = JSON.parse(localStorage.getItem("page_views") || "[]");
      pageViews.push(pageView);
      localStorage.setItem("page_views", JSON.stringify(pageViews));
    },
    trackUserEngagement: () => {
      const engagement = {
        timestamp: Date.now(),
        page: pageName,
        action: "user_engagement",
      };
      const engagements = JSON.parse(
        localStorage.getItem("user_engagements") || "[]"
      );
      engagements.push(engagement);
      localStorage.setItem("user_engagements", JSON.stringify(engagements));
    },
    trackInteraction: (event) => {
      const interaction = {
        timestamp: Date.now(),
        page: pageName,
        action: event.type,
        target: event.target.tagName,
        id: event.target.id,
        class: event.target.className,
      };
      const interactions = JSON.parse(
        localStorage.getItem("user_interactions") || "[]"
      );
      interactions.push(interaction);
      localStorage.setItem("user_interactions", JSON.stringify(interactions));
    },
    trackWatchTime: (minutes) => {
      analyticsService.updateDailyUsage(minutes);
    },
    trackVideoWatched: () => {
      analyticsService.updateDailyUsage(0, 1);
    },
  };
};

export default useAnalytics;
