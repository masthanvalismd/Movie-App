const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

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
  } catch {
    return [];
  }
};

const writeMovies = (movies) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(movies, null, 2));
};

// Generate unique ID
const generateId = () => Date.now().toString();

// ROUTES

// GET all movies
app.get("/movies", (req, res) => {
  const movies = readMovies();
  res.json(movies);
});

// GET single movie by ID
app.get("/movies/:id", (req, res) => {
  const movies = readMovies();
  const movie = movies.find((m) => m.id === req.params.id);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  res.json(movie);
});

// POST create new movie
app.post("/movies", (req, res) => {
  const movies = readMovies();
  const newMovie = {
    id: generateId(),
    ...req.body,
  };
  movies.push(newMovie);
  writeMovies(movies);
  res.status(201).json(newMovie);
});

// PUT update movie
app.put("/movies/:id", (req, res) => {
  const movies = readMovies();
  const index = movies.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Movie not found" });
  }
  movies[index] = { ...movies[index], ...req.body, id: req.params.id };
  writeMovies(movies);
  res.json(movies[index]);
});

// DELETE movie
app.delete("/movies/:id", (req, res) => {
  const movies = readMovies();
  const index = movies.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Movie not found" });
  }
  const deleted = movies.splice(index, 1)[0];
  writeMovies(movies);
  res.json(deleted);
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Movies API running at http://localhost:${PORT}`);
});
