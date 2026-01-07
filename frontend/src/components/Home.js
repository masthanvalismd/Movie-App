import { useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HistoryIcon from "@mui/icons-material/History";

import { Movie } from "./Movie";
import { HeroSkeleton, MovieCardSkeleton } from "./Skeletons";
import { useMovies } from "../hooks/useMovies";
import { useApp } from "../context/AppContext";

// Component to render a row of movies with a title and optional icon
function MovieRow({ title, movies, icon: Icon }) {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          px: { xs: 2, md: 4 },
        }}
      >
        {Icon && <Icon sx={{ color: "primary.main" }} />}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Button
          size="small"
          onClick={() => navigate("/movies")}
          sx={{ ml: "auto" }}
        >
          See All
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          px: { xs: 2, md: 4 },
          pb: 2,
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: 3,
          },
        }}
      >
        {movies.map((movie) => (
          <Box
            key={movie.id}
            sx={{
              flexShrink: 0,
              width: { xs: 160, sm: 200, md: 240 },
              scrollSnapAlign: "start",
            }}
          >
            <Movie {...movie} showActions={false} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function HeroSection({ movie }) {
  const navigate = useNavigate();

  if (!movie) return <HeroSkeleton />;

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 400, md: 550 },
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${movie.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "brightness(0.4)",
          transform: "scale(1.1)",
        }}
      />

      {/* Gradient Overlays */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, transparent 60%, transparent 100%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(transparent, rgba(20,20,20,1))",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 3, md: 6 },
          maxWidth: 700,
        }}
      >
        <Chip
          icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
          label="Featured Today"
          size="small"
          sx={{
            mb: 2,
            width: "fit-content",
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 600,
          }}
        />

        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
            lineHeight: 1.1,
            mb: 2,
            color: "white",
            textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          {movie.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Chip
            icon={
              <StarIcon sx={{ color: "#f5c518 !important", fontSize: 18 }} />
            }
            label={movie.rating ? Number(movie.rating).toFixed(1) : "N/A"}
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: 700,
              backdropFilter: "blur(4px)",
            }}
          />
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Action • Drama • 2024
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.85)",
            mb: 4,
            maxWidth: 500,
            lineHeight: 1.7,
            display: { xs: "none", sm: "-webkit-box" },
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {movie.summary}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => navigate(`/movies/${movie.id}`)}
            sx={{
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.85)",
              },
            }}
          >
            Watch Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<InfoOutlinedIcon />}
            onClick={() => navigate(`/movies/${movie.id}`)}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.5)",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            More Info
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function HomePage() {
  const { movies, loading } = useMovies();
  const { recentlyViewed } = useApp();
  const navigate = useNavigate();

  const featuredMovie = useMemo(() => {
    if (!movies.length) return null;
    const topRated = [...movies].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );
    return topRated[0];
  }, [movies]);

  const trendingMovies = useMemo(() => {
    return [...movies]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);
  }, [movies]);

  const recentMovies = useMemo(() => {
    return movies.slice(-6).reverse();
  }, [movies]);

  if (loading) {
    return (
      <Box>
        <HeroSkeleton />
        <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Loading...
          </Typography>
          <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} sx={{ flexShrink: 0, width: 240 }}>
                <MovieCardSkeleton />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero Section */}
      <HeroSection movie={featuredMovie} />

      {/* Movie Rows */}
      <Box sx={{mt:4, position: "relative", zIndex: 1 }}>
        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <MovieRow
            title="Continue Watching"
            movies={recentlyViewed}
            icon={HistoryIcon}
          />
        )}

        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          movies={trendingMovies}
          icon={TrendingUpIcon}
        />

        {/* Recently Added */}
        <MovieRow title="Recently Added" movies={recentMovies} />

        {/* All Movies Preview */}
        <Box sx={{ px: { xs: 2, md: 4 }, mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Popular on MovieFlix
          </Typography>
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
            {movies.slice(0, 8).map((movie) => (
              <Movie key={movie.id} {...movie} showActions={false} />
            ))}
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/movies")}
            >
              Browse All Movies
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export const Home = memo(HomePage);
