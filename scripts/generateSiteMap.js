const sitemap = require("nextjs-sitemap-generator");
const path = require("path");

sitemap({
  baseUrl: "https://covid19cv.info",
  pagesDirectory: path.resolve(__dirname, "../src/pages"),
  targetDirectory: "public/",
  //nextConfigPath: path.resolve(__dirname, "../next.config.js"),
  ignoredExtensions: ["png", "jpg"]
});
