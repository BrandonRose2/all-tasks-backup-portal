import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      "localhost",
      ".manus.computer",
      ".manus.space",
    ],
  },
  base: "/",
  plugins: [react(), tailwindcss(), vitePluginManusRuntime()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  root: "client",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
});
