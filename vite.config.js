import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { cpSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

const htmlInputs = Object.fromEntries(
  readdirSync(rootDir)
    .filter((file) => file.endsWith(".html"))
    .map((file) => [file.replace(/\.html$/, ""), resolve(rootDir, file)]),
);

function copyImages() {
  return {
    name: "copy-images",
    closeBundle() {
      const from = resolve(rootDir, "images");
      const to = resolve(rootDir, "dist/images");
      if (existsSync(from)) {
        cpSync(from, to, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [copyImages()],
  server: {
    host: "127.0.0.1",
    port: 43123,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 43123,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: htmlInputs,
    },
  },
});
