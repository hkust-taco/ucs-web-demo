import fs from "fs";

// Use the published version of the npm package when running on Cloudflare.
if (typeof process.env.USE_PUBLISHED_BUILD !== "undefined") {
  console.log("Using published version of npm package.");
  const original = fs.readFileSync("package.json", "utf8");
  console.log("Current package.json: ", original);
  const pkg = original.replace(/"file:\.\.\/npm\/dist"/g, () => {
    console.log("Found the local npm package.");
    return '"^0.0.1-alpha.22"';
  });
  fs.writeFileSync("package.json", pkg);
}
