import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import RefreshIcon from "@mui/icons-material/Refresh";

import { Movie } from "./Movie";
import { MovieGridSkeleton } from "./Skeletons";
import { useMovies, useDebounce } from "../hooks/useMovies";

const SORT_OPTIONS = [
  { value: "rating-desc", label: "Highest Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
  { value: "name-asc", label: "A-Z" },
  { value: "name-desc", label: "Z-A" },
];

const RATING_FILTERS = [
  { value: "all", label: "All Ratings" },
  { value: "8+", label: "8+ ⭐" },
  { value: "7+", label: "7+ ⭐" },
  { value: "6+", label: "6+ ⭐" },
];

const GENRE_FILTERS = [
  { value: "all", label: "All Genres" },
  { value: "Action", label: "Action" },
  { value: "Drama", label: "Drama" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Thriller", label: "Thriller" },
  { value: "Crime", label: "Crime" },
  { value: "Legal", label: "Legal" },
  { value: "Superhero", label: "Superhero" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Animation", label: "Animation" },
  { value: "Comedy", label: "Comedy" },
];

export function MovieList() {
  const { movies, loading, error, refetch, deleteMovie } = useMovies();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating-desc");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this movie?")) {
        try {
          await deleteMovie(id);
        } catch (err) {
          console.error("Delete failed:", err);
        }
      }
    },
    [deleteMovie]
  );

  const handleEdit = useCallback(
    (id) => navigate(`/movie/edit/${id}`),
    [navigate]
  );

  const filteredAndSortedMovies = useMemo(() => {
    let result = [...movies];

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (m) =>
          m.name?.toLowerCase().includes(query) ||
          m.summary?.toLowerCase().includes(query)
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      result = result.filter((m) => m.rating >= minRating);
    }

    // Genre filter
    if (genreFilter !== "all") {
      result = result.filter((m) =>
        m.genre?.toLowerCase().includes(genreFilter.toLowerCase())
      );
    }

    // Sorting
    const [field, order] = sortBy.split("-");
    result.sort((a, b) => {
      let comparison = 0;
      if (field === "rating") {
        comparison = (a.rating || 0) - (b.rating || 0);
      } else if (field === "name") {
        comparison = (a.name || "").localeCompare(b.name || "");
      }
      return order === "desc" ? -comparison : comparison;
    });

    return result;
  }, [movies, debouncedSearch, sortBy, ratingFilter, genreFilter]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSortBy("rating-desc");
    setRatingFilter("all");
    setGenreFilter("all");
  }, []);

  const hasActiveFilters =
    searchQuery ||
    sortBy !== "rating-desc" ||
    ratingFilter !== "all" ||
    genreFilter !== "all";

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <MovieGridSkeleton count={8} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header Section */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 4,
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.1))",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            background: "linear-gradient(90deg, #e50914, #f5c518)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Browse Movies
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              minWidth: 200,
              maxWidth: 400,
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper",
                borderRadius: 2,
              },
            }}
          />

          <Button
            variant={showFilters ? "contained" : "outlined"}
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            size="medium"
          >
            Filters
          </Button>

          {hasActiveFilters && (
            <Button
              variant="text"
              startIcon={<RefreshIcon />}
              onClick={clearFilters}
              size="small"
            >
              Clear
            </Button>
          )}
        </Box>

        {/* Filter Controls */}
        {showFilters && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              mt: 3,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>
                <SortIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Sort By
              </InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Rating</InputLabel>
              <Select
                value={ratingFilter}
                label="Rating"
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                {RATING_FILTERS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Genre</InputLabel>
              <Select
                value={genreFilter}
                label="Genre"
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                {GENRE_FILTERS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Results count */}
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={`${filteredAndSortedMovies.length} movie${
              filteredAndSortedMovies.length !== 1 ? "s" : ""
            }`}
            size="small"
            variant="outlined"
          />
          {debouncedSearch && (
            <Typography variant="body2" color="text.secondary">
              for "{debouncedSearch}"
            </Typography>
          )}
        </Box>
      </Box>

      {/* Movies Grid */}
      {filteredAndSortedMovies.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No movies found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
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
            px: { xs: 2, md: 4 },
          }}
        >
          {filteredAndSortedMovies.map((movie) => (
            <Movie
              key={movie.id}
              {...movie}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
