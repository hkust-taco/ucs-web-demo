import react from "@vitejs/plugin-react";
import path from "node:path";
import url from "node:url";
import lezer from "@chengluyu/unplugin-lezer/vite";
import mdx from "@mdx-js/rollup";
import { defineConfig } from "vite";

const rootPath = path.dirname(url.fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.mls"],
  plugins: [react(), lezer(), mdx()],
  worker: { format: "iife" },
  resolve: {
    alias: {
      "@/components": path.resolve(rootPath, "./components"),
      "@/lib": path.resolve(rootPath, "./lib"),
    },
  },
  define: {
    "process.env.VITEST":
      process.env.VITEST === undefined
        ? undefined
        : JSON.stringify(process.env.VITEST),
  },
});
