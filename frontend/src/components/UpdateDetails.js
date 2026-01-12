import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import MovieIcon from "@mui/icons-material/Movie";
import StarIcon from "@mui/icons-material/Star";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import { movieValidationSchema } from "./AddMovie";
import { useMovie } from "../hooks/useMovies";
import { movieApi } from "../services/movieApi";
import { MovieDetailsSkeleton } from "./Skeletons";

function FormField({
  name,
  label,
  icon,
  formik,
  multiline = false,
  type = "text",
}) {
  const { values, handleChange, handleBlur, touched, errors } = formik;

  return (
    <TextField
      fullWidth
      id={name}
      name={name}
      label={label}
      type={type}
      value={values[name]}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched[name] && Boolean(errors[name])}
      helperText={touched[name] && errors[name]}
      multiline={multiline}
      rows={multiline ? 4 : 1}
      InputProps={{
        startAdornment: icon && (
          <InputAdornment position="start">{icon}</InputAdornment>
        ),
      }}
      sx={{ mb: 2.5 }}
    />
  );
}

function EditMovieForm({ movie }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Convert cast array to JSON string for form display
  const initialValues = {
    ...movie,
    cast: Array.isArray(movie.cast)
      ? JSON.stringify(movie.cast, null, 2)
      : movie.cast || "",
  };

  const updateMovie = useCallback(
    async (formValues) => {
      setSubmitting(true);
      setError(null);
      try {
        // Parse cast JSON string back to array before submitting
        const updatedMovie = {
          ...formValues,
          cast: formValues.cast ? JSON.parse(formValues.cast) : [],
        };
        // console.log(`[UpdateDetails] Updating movie: ${movie.id}`);
        await movieApi.update(movie.id, updatedMovie);
        // console.log("[UpdateDetails] Movie updated successfully");
        navigate("/movies");
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.error(
            "[UpdateDetails] Invalid JSON format in Cast field:",
            err.message
          );
          setError("Invalid JSON format in Cast field");
        } else {
          console.error(
            `[UpdateDetails] Failed to update movie ${movie.id}:`,
            err.message
          );
          setError(err.message || "Failed to update movie");
        }
        setSubmitting(false);
      }
    },
    [movie.id, navigate]
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: movieValidationSchema,
    onSubmit: updateMovie,
    enableReinitialize: true,
  });

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", px: 2, py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: "linear-gradient(90deg, #e50914, #f5c518)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Edit Movie
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Update the movie details below
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <FormField
            name="name"
            label="Movie Name"
            icon={<MovieIcon color="action" />}
            formik={formik}
          />

          <FormField
            name="rating"
            label="Rating (1-10)"
            type="number"
            icon={<StarIcon color="action" />}
            formik={formik}
          />

          <FormField
            name="poster"
            label="Poster URL"
            icon={<ImageIcon color="action" />}
            formik={formik}
          />

          <FormField
            name="summary"
            label="Summary"
            icon={<DescriptionIcon color="action" />}
            formik={formik}
            multiline
          />

          <FormField
            name="trailer"
            label="Trailer URL (YouTube Embed)"
            icon={<VideoLibraryIcon color="action" />}
            formik={formik}
          />

          <FormField
            name="year"
            label="Release Year"
            type="number"
            icon={<CalendarTodayIcon color="action" />}
            formik={formik}
          />

          <FormField
            name="genre"
            label="Genre (e.g., Action, Drama)"
            icon={<CategoryIcon color="action" />}
            formik={formik}
          />

          <FormField
            name="duration"
            label="Duration (e.g., 2h 30m)"
            icon={<AccessTimeIcon color="action" />}
            formik={formik}
          />

          <FormField
            name="cast"
            label="Cast (JSON format)"
            icon={<PeopleIcon color="action" />}
            formik={formik}
            multiline
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 2, mt: -1 }}
          >
            Cast format: [{"{"}"name":"Actor
            Name","role":"Character","avatar":"image_url"{"}"}, ...]
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/movies")}
              disabled={submitting}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              color="secondary"
              sx={{ flex: 1 }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Movie"
              )}
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}

export function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, loading, error } = useMovie(id);

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/movies")}
            >
              Go Back
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">Movie not found</Typography>
        <Button onClick={() => navigate("/movies")} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return <EditMovieForm movie={movie} />;
}
