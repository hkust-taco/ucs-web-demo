import fs from "fs";

// Use the published version of the npm package when running on Cloudflare.
if (typeof process.env.CLOUDFLARE !== "undefined") {
  console.log("Using published version of npm package.")
  const original = fs.readFileSync("package.json", "utf8")
  console.log("Current package.json: ")
  const pkg = original.replace(/"file:\.\.\/npm\/dist"/g, () => {
    console.log("Found the local npm package.")
    return "\"^0.0.1-alpha.20\"";
  });
  fs.writeFileSync("package.json", pkg);
}
