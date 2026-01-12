import "./App.css";
import { Suspense, lazy, useMemo } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HomeIcon from "@mui/icons-material/Home";
import MovieIcon from "@mui/icons-material/Movie";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import { AppProvider, useApp } from "./context/AppContext";

// Lazy loaded routes for code splitting
const Home = lazy(() =>
  import("./components/Home").then((m) => ({ default: m.Home }))
);
const MovieList = lazy(() =>
  import("./components/MovieList").then((m) => ({ default: m.MovieList }))
);
const MovieDetails = lazy(() =>
  import("./components/MovieDetails").then((m) => ({ default: m.MovieDetails }))
);
const AddMovie = lazy(() =>
  import("./components/AddMovie").then((m) => ({ default: m.AddMovie }))
);
const EditMovie = lazy(() =>
  import("./components/UpdateDetails").then((m) => ({ default: m.EditMovie }))
);
const Watchlist = lazy(() =>
  import("./components/Watchlist").then((m) => ({ default: m.Watchlist }))
);
const NotFound = lazy(() =>
  import("./components/NotFound").then((m) => ({ default: m.NotFound }))
);

function LoadingFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <CircularProgress size={48} />
    </Box>
  );
}

function AppContent() {
  const { theme, toggleTheme, watchlist } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === "dark";

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: {
            main: "#e50914",
            light: "#ff4d4d",
            dark: "#b2070f",
          },
          secondary: {
            main: "#f5c518",
          },
          background: isDark
            ? { default: "#141414", paper: "#1f1f1f" }
            : { default: "#f5f5f5", paper: "#ffffff" },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 600 },
          h3: { fontWeight: 600 },
        },
        shape: { borderRadius: 8 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 600,
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [theme, isDark]
  );

  const navItems = [
    { path: "/", label: "Home", icon: <HomeIcon /> },
    { path: "/movies", label: "Browse", icon: <MovieIcon /> },
    {
      path: "/watchlist",
      label: "Watchlist",
      icon: <BookmarkIcon />,
      badge: watchlist.length,
    },
    { path: "/movie/add", label: "Add", icon: <AddIcon /> },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          transition: "background-color 0.3s ease",
        }}
      >
        {/* Navigation */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: isDark
              ? "rgba(20, 20, 20, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ gap: 1, px: { xs: 1, sm: 2 } }}>
            {/* Logo */}
            <Box
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                mr: 2,
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
              }}
            >
              <img
                src="/image.png"
                alt="MovieFlix Logo"
                style={{ height: 40, width: "auto" }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  display: { xs: "none", sm: "block" },
                  letterSpacing: "-0.5px",
                  paddingLeft: 1,
                }}
              >
                MOVIEFLIX
              </Typography>
            </Box>

            {/* Nav Links */}
            <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 }, flexGrow: 1 }}>
              {navItems.map(({ path, label, icon, badge }) => (
                <Button
                  key={path}
                  onClick={() => navigate(path)}
                  startIcon={icon}
                  size="small"
                  sx={{
                    color: isActive(path) ? "primary.main" : "text.primary",
                    fontWeight: isActive(path) ? 700 : 500,
                    position: "relative",
                    "&::after": isActive(path)
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "60%",
                          height: 3,
                          bgcolor: "primary.main",
                          borderRadius: 1,
                        }
                      : {},
                    "& .MuiButton-startIcon": {
                      mr: { xs: 0, sm: 1 },
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", md: "inline" } }}
                  >
                    {label}
                  </Box>
                  {badge > 0 && (
                    <Box
                      component="span"
                      sx={{
                        ml: 0.5,
                        px: 0.8,
                        py: 0.1,
                        fontSize: "0.7rem",
                        bgcolor: "primary.main",
                        color: "white",
                        borderRadius: 10,
                        fontWeight: 700,
                      }}
                    >
                      {badge}
                    </Box>
                  )}
                </Button>
              ))}
            </Box>

            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0, 0, 0, 0.37)",
                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(23, 21, 21, 0.78)",
                },
              }}
            >
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box component="main" sx={{ pt: 8 }}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<MovieList />} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/movie/add" element={<AddMovie />} />
              <Route path="/movie/edit/:id" element={<EditMovie />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
