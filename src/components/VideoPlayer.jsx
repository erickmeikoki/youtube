import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import useAnalytics from "../hooks/useAnalytics";

const VideoPlayer = ({ videoId, title, channelTitle }) => {
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const { trackWatchTime, trackVideoWatched } = useAnalytics("video");

  useEffect(() => {
    // Listen for messages from the YouTube iframe
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;

      try {
        const data = JSON.parse(event.data);
        switch (data.event) {
          case "onStateChange":
            if (data.info === 1) {
              // Video started playing
              setIsPlaying(true);
              setStartTime(Date.now());
              trackVideoWatched();
            } else if (data.info === 0 || data.info === 2) {
              // Video ended or paused
              if (isPlaying && startTime) {
                const watchTime = Math.round(
                  (Date.now() - startTime) / 1000 / 60
                ); // Convert to minutes
                trackWatchTime(watchTime);
              }
              setIsPlaying(false);
              setStartTime(null);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error handling YouTube message:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isPlaying, startTime, trackWatchTime, trackVideoWatched]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (isPlaying && startTime) {
        const watchTime = Math.round((Date.now() - startTime) / 1000 / 60); // Convert to minutes
        trackWatchTime(watchTime);
      }
    };
  }, [isPlaying, startTime, trackWatchTime]);

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ position: "relative", paddingTop: "56.25%", mb: 2 }}>
        <iframe
          ref={iframeRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {channelTitle}
      </Typography>
    </Paper>
  );
};

export default VideoPlayer;
