import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env": {},
  },
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:4000",

        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
});
