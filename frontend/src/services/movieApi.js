// Local Express backend
const API_BASE_URL = "http://localhost:5000/movies";

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
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch movies");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Movie not found");
    return response.json();
  },

  create: async (movie) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    });
    if (!response.ok) throw new Error("Failed to create movie");
    return response.json();
  },

  update: async (id, movie) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    });
    if (!response.ok) throw new Error("Failed to update movie");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete movie");
    return response.json();
  },
};

export { API_BASE_URL };
