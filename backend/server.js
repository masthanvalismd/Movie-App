const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Initialize Express app
const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, "movies.json");

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions to read/write data
const readMovies = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("[ERROR] Failed to read movies file:", error.message);
    return [];
  }
};

const writeMovies = (movies) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(movies, null, 2));
  } catch (error) {
    console.error("[ERROR] Failed to write movies file:", error.message);
    throw error;
  }
};

// Generate unique ID
const generateId = () => Date.now().toString();

// ROUTES

// GET all movies
app.get("/movies", (req, res) => {
  try {
    const movies = readMovies();
    // console.log(`[INFO] Returning ${movies.length} movies`);
    res.json(movies);
  } catch (error) {
    console.error("[ERROR] GET /movies failed:", error.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// GET single movie by ID
    app.get("/movies/:id", (req, res) => {
  try {
    const movies = readMovies();
    const movie = movies.find((m) => m.id === req.params.id);
    if (!movie) {
      console.warn(`[WARN] Movie not found with id: ${req.params.id}`);
      return res.status(404).json({ error: "Movie not found" });
    }
    // console.log(`[INFO] Found movie: ${movie.name}`);
    res.json(movie);
  } catch (error) {
    console.error(
      `[ERROR] GET /movies/${req.params.id} failed:`,
      error.message
    );
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

// POST create new movie
app.post("/movies", (req, res) => {
//   console.log(`[INFO] Creating movie:`, req.body.name || "Unknown");
  try {
    const movies = readMovies();
    const newMovie = {
      id: generateId(),
      ...req.body,
    };
    movies.push(newMovie);
    writeMovies(movies);
    // console.log(`[INFO] Movie created successfully with id: ${newMovie.id}`);
    res.status(201).json(newMovie);
  } catch (error) {
    console.error("[ERROR] POST /movies failed:", error.message);
    res.status(500).json({ error: "Failed to create movie" });
  }
});

// PUT update movie
app.put("/movies/:id", (req, res) => {
  try {
    const movies = readMovies();
    const index = movies.findIndex((m) => m.id === req.params.id);
    if (index === -1) {
      console.warn(
        `[WARN] Movie not found for update with id: ${req.params.id}`
      );
      return res.status(404).json({ error: "Movie not found" });
    }
    movies[index] = { ...movies[index], ...req.body, id: req.params.id };
    writeMovies(movies);
    // console.log(`[INFO] Movie updated successfully: ${movies[index].name}`);
    res.json(movies[index]);
  } catch (error) {
    console.error(
      `[ERROR] PUT /movies/${req.params.id} failed:`,
      error.message
    );
    res.status(500).json({ error: "Failed to update movie" });
  }
});

// DELETE movie
app.delete("/movies/:id", (req, res) => {
  try {
    const movies = readMovies();
    const index = movies.findIndex((m) => m.id === req.params.id);
    if (index === -1) {
      console.warn(
        `[WARN] Movie not found for deletion with id: ${req.params.id}`
      );
      return res.status(404).json({ error: "Movie not found" });
    }
    const deleted = movies.splice(index, 1)[0];
    writeMovies(movies);
    // console.log(`[INFO] Movie deleted successfully: ${deleted.name}`);
    res.json(deleted);
  } catch (error) {
    console.error(
      `[ERROR] DELETE /movies/${req.params.id} failed:`,
      error.message
    );
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Movies API running at http://localhost:${PORT}`);
});
