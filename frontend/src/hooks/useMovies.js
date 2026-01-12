import { useState, useEffect, useCallback } from "react";
import { movieApi } from "../services/movieApi";

// Hook to manage list of movies
export function useMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    // console.log("[useMovies] Fetching movies...");
    try {
      setLoading(true);
      setError(null);
      const data = await movieApi.getAll();
      // console.log(`[useMovies] Loaded ${data.length} movies successfully`);
      setMovies(data);
    } catch (err) {
      console.error("[useMovies] fetchMovies failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const deleteMovie = useCallback(async (id) => {
    // console.log(`[useMovies] Deleting movie with id: ${id}`);
    try {
      await movieApi.delete(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      // console.log(`[useMovies] Movie deleted successfully: ${id}`);
    } catch (err) {
      console.error(`[useMovies] deleteMovie(${id}) failed:`, err.message);
      throw err;
    }
  }, []);

  return { movies, loading, error, refetch: fetchMovies, deleteMovie };
}

export function useMovie(id) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      // console.log(`[useMovie] Fetching movie with id: ${id}`);
      try {
        setLoading(true);
        setError(null);
        const data = await movieApi.getById(id);
        // console.log(`[useMovie] Loaded movie: ${data.name}`);
        setMovie(data);
      } catch (err) {
        console.error(`[useMovie] fetchMovie(${id}) failed:`, err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  return { movie, loading, error };
}

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
