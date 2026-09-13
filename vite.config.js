import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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
      writeFileSync(
        resolve(rootDir, "dist/.gitkeep"),
        "# Keep dist in git so Wrangler assets.directory exists before Vite runs.\n",
      );
    },
  };
}

function htmlIncludes() {
  const partialsDir = resolve(rootDir, "partials");
  const includePattern = /^[ \t]*<!--\s*include:(\S+?)\s*-->[ \t]*$/gm;

  function expandIncludes(html) {
    return html.replace(includePattern, (_, file) => {
      const from = resolve(rootDir, file);
      if (!existsSync(from)) {
        throw new Error(`HTML include not found: ${file}`);
      }
      return readFileSync(from, "utf8").replace(/\n$/, "");
    });
  }

  return {
    name: "html-includes",
    transformIndexHtml: {
      order: "pre",
      handler: expandIncludes,
    },
    configureServer(server) {
      server.watcher.add(partialsDir);
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir)) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}

export default defineConfig({
  plugins: [htmlIncludes(), copyImages()],
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
