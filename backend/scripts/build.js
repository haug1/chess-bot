const ncc = require("@vercel/ncc");
const pkg = require("pkg");
const path = require("path");
const { writeFileSync, unlinkSync } = require("fs");
const { isWindows } = require("../src/utils");

(async () => {
  const inputFilepath = path.relative(__dirname, process.argv[2] + "/index.js");
  const { code } = await ncc(inputFilepath);
  writeFileSync("out.cjs", code);
  await pkg.exec([
    "out.cjs",
    "--target",
    "host",
    "--output",
    "dist/" + process.argv[2] + (isWindows() ? ".exe" : ""),
  ]);
  unlinkSync("out.cjs");
})();
