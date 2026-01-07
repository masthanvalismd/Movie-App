import { useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";

import { MovieDetailsSkeleton } from "./Skeletons";
import { useMovie } from "../hooks/useMovies";
import { useApp } from "../context/AppContext";
import { parseCast } from "../services/movieApi";

export function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, loading, error } = useMovie(id);
  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToRecentlyViewed,
  } = useApp();

  const inWatchlist = useMemo(() => isInWatchlist(id), [isInWatchlist, id]);

  // Add to recently viewed when movie loads
  useEffect(() => {
    if (movie) {
      addToRecentlyViewed(movie);
    }
  }, [movie, addToRecentlyViewed]);

  const handleWatchlistToggle = useCallback(() => {
    if (inWatchlist) {
      removeFromWatchlist(id);
    } else if (movie) {
      addToWatchlist(movie);
    }
  }, [inWatchlist, id, movie, addToWatchlist, removeFromWatchlist]);

  const goBack = useCallback(() => navigate(-1), [navigate]);
  const goToEdit = useCallback(
    () => navigate(`/movie/edit/${id}`),
    [navigate, id]
  );

  const trailerRef = useRef(null);

  const scrollToTrailer = useCallback(() => {
    if (trailerRef.current) {
      trailerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // If it's a YouTube embed, try to autoplay by updating src
      const iframe = trailerRef.current.querySelector("iframe");
      if (iframe && iframe.src.includes("youtube")) {
        const src = iframe.src;
        if (!src.includes("autoplay=1")) {
          iframe.src = src + (src.includes("?") ? "&" : "?") + "autoplay=1";
        }
      }
    }
  }, []);

  if (loading) return <MovieDetailsSkeleton />;

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Movie not found
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const getRatingColor = (r) =>
    r >= 8 ? "#46d369" : r >= 6 ? "#f5c518" : "#ff6b6b";

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero Section with Trailer */}
      <Box
        ref={trailerRef}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: { xs: "16/9", md: "21/9" },
          bgcolor: "black",
          overflow: "hidden",
        }}
      >
        <iframe
          src={movie.trailer}
          title={`${movie.name} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />

        {/* Gradient overlay at bottom */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
            pointerEvents: "none",
          }}
        />

        {/* Back button */}
        <IconButton
          onClick={goBack}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          }}
          aria-label="Go back"
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Movie Info Section */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          mt: { xs: -4, md: -8 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, md: 4 },
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* Poster */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: 140, sm: 200, md: 280 },
              height: { xs: 200, sm: 280, md: 400 },
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src={movie.poster}
              alt={`${movie.name} poster`}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </Box>

          {/* Details */}
          <Box sx={{ flex: 1, pt: { xs: 0, md: 4 } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                marginTop: { xs:"2.5rem",md:"revert"}
              }}
            >
              {movie.name}
            </Typography>

            {/* Meta info */}
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 3 }}>
              <Chip
                icon={<StarIcon sx={{ color: "#fff !important" }} />}
                label={movie.rating ? Number(movie.rating).toFixed(1) : "N/A"}
                sx={{
                  bgcolor: getRatingColor(Number(movie.rating)),
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  height: 36,
                }}
              />
              {movie.year && <Chip label={movie.year} variant="outlined" />}
              {movie.genre && <Chip label={movie.genre} variant="outlined" />}
              {movie.duration && (
                <Chip label={movie.duration} variant="outlined" />
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={scrollToTrailer}
                sx={{
                  bgcolor: "white",
                  color: "black",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.85)" },
                  fontWeight: 600,
                  px: 4,
                }}
              >
                Play Trailer
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={
                  inWatchlist ? <BookmarkIcon /> : <BookmarkBorderIcon />
                }
                onClick={handleWatchlistToggle}
                color={inWatchlist ? "primary" : "inherit"}
              >
                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </Button>

              <IconButton
                onClick={goToEdit}
                sx={{ border: 1, borderColor: "divider" }}
                aria-label="Edit movie"
              >
                <EditIcon />
              </IconButton>
            </Box>

            {/* Summary */}
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: "text.secondary",
                maxWidth: 700,
              }}
            >
              {movie.summary}
            </Typography>
          </Box>
        </Box>

        {/* Cast Section */}
        {parseCast(movie.cast).length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Cast & Crew
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 2,
              }}
            >
              {parseCast(movie.cast).map((person, idx) => (
                <Box
                  key={idx}
                  sx={{
                    textAlign: "center",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-4px)" },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      overflow: "hidden",
                      mx: "auto",
                      mb: 1.5,
                    }}
                  >
                    <img
                      src={person.avatar}
                      alt={person.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {person.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {person.role}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
