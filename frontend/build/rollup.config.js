import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

function createConfig(name) {
  return {
    input: `src/${name}/index.ts`,
    output: {
      dir: "bin/" + name,
      format: "iife",
    },
    plugins: [
      resolve(),
      typescript(),
      commonjs(),
      terser(),
      {
        name: "generate-manifest",
        generateBundle(_, bundle) {
          this.emitFile({
            type: "asset",
            fileName: "manifest.json",
            source: JSON.stringify(createManifest(name)),
          });
        },
      },
    ],
  };
}

function createManifest(name) {
  return {
    manifest_version: 2,
    name: name + " bot",
    description:
      "A firefox extension that shows the best moves provided by the stockfish backend for games on " +
      name,
    version: "1.0.0",

    content_scripts: [
      {
        matches: [urlMatches(name)],
        js: ["index.js"],
      },
    ],

    permissions: ["activeTab", "*://localhost/*"],
  };
}

function urlMatches(name) {
  switch (name) {
    case "chess.com":
      return "https://www.chess.com/play/computer";
    case "lichess":
      return "https://lichess.org/*";
    default:
      break;
  }
}

export default [createConfig("chess.com"), createConfig("lichess")];
