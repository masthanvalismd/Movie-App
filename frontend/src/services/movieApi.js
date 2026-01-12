// Local Express backend
// const API_BASE_URL = "http://localhost:5000/movies";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Log the API URL being used (helps debug environment issues)
// console.log("[API] Using API URL:", API_BASE_URL);
if (!API_BASE_URL) {
  console.error(
    "[API ERROR] REACT_APP_API_BASE_URL is not defined! Check your .env file."
  );
}

// Helper to parse cast (handles both array and JSON string)
export const parseCast = (castData) => {
  if (!castData) return [];
  if (Array.isArray(castData)) return castData;
  try {
    return JSON.parse(castData);
  } catch {
    return [];
  }
};

export const movieApi = {
  getAll: async () => {
    // console.log("[API] Fetching all movies...");
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        console.error(
          `[API ERROR] getAll failed with status: ${response.status} ${response.statusText}`
        );
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      // console.log(`[API] Successfully fetched ${data.length} movies`);
      return data;
    } catch (error) {
      console.error("[API ERROR] getAll:", error.message);
      throw error;
    }
  },

  getById: async (id) => {
    // console.log(`[API] Fetching movie with id: ${id}`);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        console.error(
          `[API ERROR] getById(${id}) failed with status: ${response.status} ${response.statusText}`
        );
        throw new Error("Movie not found");
      }
      const data = await response.json();
      // console.log(`[API] Successfully fetched movie: ${data.name}`);
      return data;
    } catch (error) {
      console.error(`[API ERROR] getById(${id}):`, error.message);
      throw error;
    }
  },

  create: async (movie) => {
    // console.log(`[API] Creating movie: ${movie.name}`);
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
      if (!response.ok) {
        console.error(
          `[API ERROR] create failed with status: ${response.status} ${response.statusText}`
        );
        throw new Error("Failed to create movie");
      }
      const data = await response.json();
      // console.log(`[API] Successfully created movie with id: ${data.id}`);
      return data;
    } catch (error) {
      console.error("[API ERROR] create:", error.message);
      throw error;
    }
  },

  update: async (id, movie) => {
    // console.log(`[API] Updating movie with id: ${id}`);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
      if (!response.ok) {
        console.error(
          `[API ERROR] update(${id}) failed with status: ${response.status} ${response.statusText}`
        );
        throw new Error("Failed to update movie");
      }
      const data = await response.json();
      // console.log(`[API] Successfully updated movie: ${data.name}`);
      return data;
    } catch (error) {
      console.error(`[API ERROR] update(${id}):`, error.message);
      throw error;
    }
  },

  delete: async (id) => {
    // console.log(`[API] Deleting movie with id: ${id}`);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error(
          `[API ERROR] delete(${id}) failed with status: ${response.status} ${response.statusText}`
        );
        throw new Error("Failed to delete movie");
      }
      const data = await response.json();
      // console.log(`[API] Successfully deleted movie: ${data.name}`);
      return data;
    } catch (error) {
      console.error(`[API ERROR] delete(${id}):`, error.message);
      throw error;
    }
  },
};

export { API_BASE_URL };
