import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
// Context to manage global app state: theme, watchlist, recently viewed
const AppContext = createContext(null);

const STORAGE_KEYS = {
  WATCHLIST: "movies_watchlist",
  RECENTLY_VIEWED: "movies_recently_viewed",
  THEME: "movies_theme",
};

function getStoredData(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("Failed to save to localStorage:", err);
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    getStoredData(STORAGE_KEYS.THEME, "dark")
  );
  const [watchlist, setWatchlist] = useState(() =>
    getStoredData(STORAGE_KEYS.WATCHLIST, [])
  );
  const [recentlyViewed, setRecentlyViewed] = useState(() =>
    getStoredData(STORAGE_KEYS.RECENTLY_VIEWED, [])
  );

  // Persist theme changes
  useEffect(() => {
    setStoredData(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist watchlist changes
  useEffect(() => {
    setStoredData(STORAGE_KEYS.WATCHLIST, watchlist);
  }, [watchlist]);

  // Persist recently viewed changes
  useEffect(() => {
    setStoredData(STORAGE_KEYS.RECENTLY_VIEWED, recentlyViewed);
  }, [recentlyViewed]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const addToWatchlist = useCallback((movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [movie, ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const isInWatchlist = useCallback(
    (movieId) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  const addToRecentlyViewed = useCallback((movie) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((m) => m.id !== movie.id);
      return [movie, ...filtered].slice(0, 10); // Keep only last 10
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      recentlyViewed,
      addToRecentlyViewed,
      clearRecentlyViewed,
    }),
    [
      theme,
      toggleTheme,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      recentlyViewed,
      addToRecentlyViewed,
      clearRecentlyViewed,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
