import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";

const CLIENT_ID = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
const REDIRECT_URI = "http://localhost:5173/YouTubeComment"; // Change when deploying
const SCOPES = "https://www.googleapis.com/auth/youtube.readonly"; // Changed to readonly for fetching data
const COMMENT_TEXT = "Your custom comment text here";

const YouTubeComment = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [videos, setVideos] = useState([]);
  const [comment, setComment] = useState(COMMENT_TEXT);
  const [status, setStatus] = useState("Not signed in");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Start OAuth 2.0 flow
  const handleSignIn = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${encodeURIComponent(
      SCOPES
    )}&include_granted_scopes=true`;
    window.location.href = authUrl;
  };

  // Extract token from URL hash after OAuth redirect
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substr(1));
      const token = params.get("access_token");
      if (token) {
        setAccessToken(token);
        localStorage.setItem("access_token", token); // Save token to localStorage
        window.history.replaceState(null, "", window.location.pathname); // Clean URL
      }
    }
  }, []);

  // Fetch uploaded videos
  const fetchVideos = async () => {
    setStatus("Fetching videos...");
    setError(null);
    setLoading(true);

    try {
      const channelRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            part: "contentDetails",
            mine: true,
          },
        }
      );

      const uploadsPlaylistId =
        channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

      let allVideos = [];
      let nextPageToken = "";

      do {
        const playlistRes = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              part: "snippet",
              playlistId: uploadsPlaylistId,
              maxResults: 50,
              pageToken: nextPageToken,
            },
          }
        );

        allVideos = [...allVideos, ...playlistRes.data.items];
        nextPageToken = playlistRes.data.nextPageToken;
      } while (nextPageToken);

      setVideos(allVideos);
      setStatus(`Fetched ${allVideos.length} videos.`);
    } catch (err) {
      setError("Error fetching videos: " + err.message);
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  // Post comments to each video and hold for review
  const postComments = async () => {
    setStatus("Posting comments...");
    setError(null);
    setLoading(true);

    try {
      for (const video of videos) {
        const videoId = video.snippet.resourceId.videoId;

        try {
          // Step 1: Post the comment
          const response = await axios.post(
            `https://www.googleapis.com/youtube/v3/commentThreads`,
            {
              snippet: {
                videoId: videoId,
                topLevelComment: {
                  snippet: {
                    textOriginal: comment,
                  },
                },
              },
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              params: {
                part: "snippet",
              },
            }
          );

          // Step 2: Get comment ID and mark it as held for review
          const commentId = response.data.id;

          await axios.post(
            `https://www.googleapis.com/youtube/v3/comments/setModerationStatus`,
            {
              id: commentId,
              moderationStatus: "heldForReview", // Mark the comment as held for review
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log(`Comment posted and held for review on video ${videoId}`);
        } catch (err) {
          console.error(`Error posting comment on video ${videoId}:`, err);
          setError((prev) =>
            prev
              ? `${prev}; ${videoId}: ${err.message}`
              : `${videoId}: ${err.message}`
          );
        }
      }

      setStatus("Completed posting comments.");
    } catch (err) {
      setError("Error during comment operations: " + err.message);
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 4, mt: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          YouTube Comment Poster
        </Typography>
        {!accessToken ? (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSignIn}
            sx={{ mt: 2 }}
          >
            Sign in with Google
          </Button>
        ) : (
          <>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setAccessToken(null)}
              sx={{ mt: 2 }}
            >
              Sign out
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={fetchVideos}
              sx={{ mt: 2 }}
            >
              Fetch My Videos
            </Button>
            <TextField
              fullWidth
              label="Comment Text"
              variant="outlined"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={postComments}
              sx={{ mt: 2 }}
              disabled={videos.length === 0 || status === "Posting comments..."}
            >
              {loading ? <CircularProgress size={24} /> : "Post Comments"}
            </Button>
            <Typography sx={{ mt: 2 }} align="center">
              Status: {status}
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {videos.length > 0 && (
              <div>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Videos ({videos.length})
                </Typography>
                <ul>
                  {videos.map((video) => (
                    <li key={video.id}>{video.snippet.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default YouTubeComment;
