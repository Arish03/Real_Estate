// src/config/api.ts
// Get API URL from environment variables or use default for development
export const BACKEND_URL: string =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default API_BASE_URL;
