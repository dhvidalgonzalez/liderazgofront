import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/liderazgo",
  plugins: [react()],
  server: {
    port: 3003,
  },
  resolve: {
    alias: {
      src: "/src",
    },
  },
});
