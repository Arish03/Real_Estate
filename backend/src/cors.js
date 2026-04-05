import FastifyCors from "@fastify/cors";

export const setFastifyCors = function (fastify) {
  fastify.register(FastifyCors, {
    // allow localhost ports for development
    // Frontend (Vite) runs on 5173, alternative ports for different dev scenarios
    origin: [
      "http://localhost:5173", // Vite default dev port
      "http://localhost:3000",  // Common alternative
      "http://localhost:3001",  // Common alternative
      "http://localhost:8080",  // Common alternative
      "http://127.0.0.1:5173",  // IPv4 loopback
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:8080",
    ],
    credentials: true, // Allow credentials (cookies, auth headers)
  });
};
