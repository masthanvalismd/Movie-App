import { memo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import MovieIcon from "@mui/icons-material/Movie";


function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "6rem", md: "10rem" },
          fontWeight: 800,
          background: "linear-gradient(135deg, #e50914, #f5c518)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          mb: 2,
        }}
      >
        404
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Lost in the Movies?
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 400 }}
      >
        The page you're looking for has gone off-script. Let's get you back to
        the main feature.
      </Typography>

      <Box
        sx={{
          mb: 4,
          width: "100%",
          maxWidth: 400,
          height: 200,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <img
          src="https://assets.materialup.com/uploads/26541cce-49c6-4e35-a055-e11b90ffad68/preview.gif"
          alt="404 - Lost"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          loading="lazy"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<MovieIcon />}
          onClick={() => navigate("/movies")}
        >
          Browse Movies
        </Button>
      </Box>
    </Box>
  );
}

export const NotFound = memo(NotFoundPage);
