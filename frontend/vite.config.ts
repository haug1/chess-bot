import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const browserManifest = {
  manifest_version: 2,
  name: "Chess bot",
  description:
    "A browser extension that shows the best moves provided by the stockfish backend for games on lichess/chess.com",
  version: "1.0.0",
  content_scripts: [
    {
      matches: ["https://www.chess.com/*", "https://lichess.org/*"],
      js: ["chess-bot.iife.js"],
      css: ["style.css"],
    },
  ],
  permissions: ["activeTab", "*://localhost/*"],
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      name: "ChessBot",
      fileName: "chess-bot",
      entry: "src/main.ts",
      formats: ["iife"],
    },
    outDir: "bin",
  },
  plugins: [
    svelte(),
    {
      name: "generate-manifest",
      generateBundle(_, __) {
        this.emitFile({
          type: "asset",
          fileName: "manifest.json",
          source: JSON.stringify(browserManifest),
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@/*": "./src",
      "fetch-event-source": "./lib/fetch-event-source/bin/esm/index.js",
    },
  },
});
