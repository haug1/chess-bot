const pkg = require("pkg");
const { unlinkSync } = require("fs");
const { rollup } = require("rollup");
const resolve = require("@rollup/plugin-node-resolve");
const json = require("@rollup/plugin-json");
const { isWindows } = require("../src/utils");
const { default: commonjs } = require("@rollup/plugin-commonjs");

(async () => {
  const result = await rollup({
    input: process.argv[2] + "/index.js",
    output: {
      file: "dist/out.cjs",
      format: "cjs",
    },
    plugins: [json(), resolve(), commonjs()],
  });
  await result.write({
    format: "cjs",
    file: "dist/out.cjs",
  });
  await pkg.exec([
    "dist/out.cjs",
    "--target",
    "host",
    "--output",
    "dist/" + process.argv[2] + (isWindows() ? ".exe" : ""),
  ]);
  unlinkSync("dist/out.cjs");
})();
