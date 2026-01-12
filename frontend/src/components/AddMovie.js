import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
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
import { movieApi } from "../services/movieApi";

export const movieValidationSchema = yup.object({
  name: yup.string().required("Movie name is required"),
  rating: yup
    .number()
    .min(1, "Rating must be at least 1")
    .max(10, "Rating cannot exceed 10")
    .required("Rating is required"),
  poster: yup
    .string()
    .url("Please provide a valid URL")
    .required("Poster URL is required"),
  summary: yup
    .string()
    .min(20, "Summary should be at least 20 characters")
    .required("Summary is required"),
  trailer: yup
    .string()
    .url("Please provide a valid YouTube embed URL")
    .required("Trailer URL is required"),
  year: yup
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 5, "Year seems too far in the future")
    .required("Year is required"),
  genre: yup.string().required("Genre is required"),
  duration: yup.string().required("Duration is required (e.g., 2h 30m)"),
  cast: yup.string(),
});

const initialFormValues = {
  name: "",
  rating: "",
  poster: "",
  summary: "",
  trailer: "",
  year: "",
  genre: "",
  duration: "",
  cast: "",
};

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

export function AddMovie() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const addMovie = useCallback(
    async (formValues) => {
      setSubmitting(true);
      setError(null);
      try {
        // Parse cast JSON string to array before submitting
        const newMovie = {
          ...formValues,
          cast: formValues.cast ? JSON.parse(formValues.cast) : [],
        };
        // console.log("[AddMovie] Creating new movie:", newMovie.name);
        await movieApi.create(newMovie);
        // console.log("[AddMovie] Movie created successfully");
        navigate("/movies");
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.error(
            "[AddMovie] Invalid JSON format in Cast field:",
            err.message
          );
          setError("Invalid JSON format in Cast field");
        } else {
          console.error("[AddMovie] Failed to create movie:", err.message);
          setError(err.message || "Failed to add movie");
        }
        setSubmitting(false);
      }
    },
    [navigate]
  );

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: movieValidationSchema,
    onSubmit: addMovie,
  });

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        px: 2,
        py: 4,
      }}
    >
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
          Add New Movie
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the details to add a movie to the collection
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
              sx={{ flex: 1 }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Movie"
              )}
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
