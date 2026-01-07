import { useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useApp } from "../context/AppContext";

const getRatingColor = (rating) => {
  if (rating >= 8) return "#46d369";
  if (rating >= 6) return "#f5c518";
  return "#ff6b6b";
};

function MovieCardComponent({
  id,
  poster,
  name,
  rating,
  summary,
  onDelete,
  onEdit,
  showActions = true,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp();

  const inWatchlist = useMemo(() => isInWatchlist(id), [isInWatchlist, id]);

  const handleWatchlistToggle = useCallback(
    (e) => {
      e.stopPropagation();
      if (inWatchlist) {
        removeFromWatchlist(id);
      } else {
        addToWatchlist({ id, poster, name, rating, summary });
      }
    },
    [
      inWatchlist,
      id,
      poster,
      name,
      rating,
      summary,
      addToWatchlist,
      removeFromWatchlist,
    ]
  );

  const handleCardClick = useCallback(() => {
    navigate(`/movies/${id}`);
  }, [navigate, id]);

  const handleEdit = useCallback(
    (e) => {
      e.stopPropagation();
      if (onEdit) onEdit(id);
      else navigate(`/movie/edit/${id}`);
    },
    [onEdit, id, navigate]
  );

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      if (onDelete) onDelete(id);
    },
    [onDelete, id]
  );

  const toggleSummary = useCallback((e) => {
    e.stopPropagation();
    setShowSummary((prev) => !prev);
  }, []);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        bgcolor: "background.paper",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "scale(1.03)" : "scale(1)",
        boxShadow: isHovered
          ? "0 16px 40px rgba(0,0,0,0.4)"
          : "0 4px 12px rgba(0,0,0,0.15)",
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 2,
        },
      }}
      tabIndex={0}
      role="article"
      aria-label={`${name}, Rating: ${rating}`}
    >
      {/* Poster Image */}
      <Box sx={{ position: "relative", aspectRatio: "2/3" }}>
        <CardMedia
          component="img"
          image={poster}
          alt={`${name} poster`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          sx={{
            height: "100%",
            objectFit: "cover",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isHovered
              ? "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)"
              : "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 50%)",
            transition: "all 0.3s ease",
          }}
        />

        {/* Rating Badge */}
        <Chip
          icon={<StarIcon sx={{ fontSize: 16, color: "#fff !important" }} />}
          label={rating ? Number(rating).toFixed(1) : "N/A"}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: getRatingColor(Number(rating)),
            color: "white",
            fontWeight: 700,
            fontSize: "0.8rem",
          }}
        />

        {/* Watchlist Button */}
        <Tooltip
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <IconButton
            onClick={handleWatchlistToggle}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: "rgba(0,0,0,0.6)",
              color: inWatchlist ? "primary.main" : "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
            aria-label={
              inWatchlist ? "Remove from watchlist" : "Add to watchlist"
            }
          >
            {inWatchlist ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Tooltip>

        {/* Play Button (visible on hover) */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <IconButton
            sx={{
              bgcolor: "primary.main",
              color: "white",
              width: 56,
              height: 56,
              "&:hover": { bgcolor: "primary.dark", transform: "scale(1.1)" },
            }}
            aria-label="View details"
          >
            <PlayArrowIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>

        {/* Movie Info */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: "white",
              fontWeight: 600,
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </Typography>

          {/* Action Buttons */}
          {showActions && (
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                mt: 1,
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.2s ease",
              }}
            >
              <IconButton
                size="small"
                onClick={toggleSummary}
                sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)" }}
                aria-label={showSummary ? "Hide summary" : "Show summary"}
              >
                {showSummary ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>

              {onEdit && (
                <IconButton
                  size="small"
                  onClick={handleEdit}
                  sx={{ color: "#f5c518", bgcolor: "rgba(255,255,255,0.1)" }}
                  aria-label="Edit movie"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}

              {onDelete && (
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  sx={{ color: "#ff6b6b", bgcolor: "rgba(255,255,255,0.1)" }}
                  aria-label="Delete movie"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Expandable Summary */}
      {showSummary && (
        <Box sx={{ p: 2, pt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {summary}
          </Typography>
        </Box>
      )}
    </Card>
  );
}

export const Movie = memo(MovieCardComponent);
