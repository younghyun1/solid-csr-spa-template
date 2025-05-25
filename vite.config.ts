import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
const pkg = require("./package.json");

export default defineConfig({
  plugins: [solidPlugin()],
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
    __SOLID_VERSION__: JSON.stringify(pkg.dependencies["solid-js"] || ""),
  },
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: () => "app.js",
      },
    },
  },
});
