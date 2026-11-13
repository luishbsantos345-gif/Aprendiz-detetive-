import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  // Caminho relativo: o mesmo build funciona no GitHub Pages (subpasta),
  // no modo host local (raiz) e em qualquer outro lugar.
  base: "./",
  resolve: {
    alias: {
      "@aprendiz/shared": fileURLToPath(new URL("../shared/src/index.ts", import.meta.url)),
    },
  },
  server: { host: true, port: 5173 },
  build: { target: "es2022", sourcemap: true, chunkSizeWarningLimit: 900 },
});
