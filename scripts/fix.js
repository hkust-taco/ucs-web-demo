import fs from "fs";

const pkg = fs.readFileSync("package.json", "utf8")
  .replace(/"file:\.\.\/npm\/dist"/g, "\"^0.0.1-alpha.20\"");
fs.writeFileSync("package.json", pkg);
