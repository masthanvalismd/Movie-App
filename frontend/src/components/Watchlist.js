import { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import MovieIcon from "@mui/icons-material/Movie";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { Movie } from "./Movie";
import { useApp } from "../context/AppContext";

function WatchlistPage() {
  const navigate = useNavigate();
  const {
    watchlist,
    removeFromWatchlist,
    clearRecentlyViewed,
    recentlyViewed,
  } = useApp();

  const handleRemove = useCallback(
    (id) => {
      removeFromWatchlist(id);
    },
    [removeFromWatchlist]
  );

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <BookmarkIcon sx={{ fontSize: 40, color: "primary.main" }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            My Watchlist
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {watchlist.length} movie{watchlist.length !== 1 ? "s" : ""} saved
          </Typography>
        </Box>
      </Box>

      {/* Watchlist Content */}
      {watchlist.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
            bgcolor: "background.paper",
            borderRadius: 3,
          }}
        >
          <BookmarkIcon
            sx={{ fontSize: 80, color: "action.disabled", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Your watchlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start adding movies you want to watch later
          </Typography>
          <Button
            variant="contained"
            startIcon={<MovieIcon />}
            onClick={() => navigate("/movies")}
          >
            Browse Movies
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(auto-fill, minmax(160px, 1fr))",
              sm: "repeat(auto-fill, minmax(200px, 1fr))",
              md: "repeat(auto-fill, minmax(240px, 1fr))",
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {watchlist.map((movie) => (
            <Box key={movie.id} sx={{ position: "relative" }}>
              <Movie {...movie} showActions={false} />
              <IconButton
                onClick={() => handleRemove(movie.id)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.7)",
                  color: "error.main",
                  "&:hover": { bgcolor: "error.main", color: "white" },
                }}
                aria-label="Remove from watchlist"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Recently Viewed
            </Typography>
            <Button size="small" color="inherit" onClick={clearRecentlyViewed}>
              Clear History
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 2,
              "&::-webkit-scrollbar": { height: 6 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: 3,
              },
            }}
          >
            {recentlyViewed.map((movie) => (
              <Box
                key={movie.id}
                sx={{
                  flexShrink: 0,
                  width: { xs: 160, sm: 200, md: 220 },
                }}
              >
                <Movie {...movie} showActions={false} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export const Watchlist = memo(WatchlistPage);
