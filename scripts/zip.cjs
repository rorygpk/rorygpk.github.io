const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

if (!fs.existsSync(path.join(process.cwd(), "public"))) {
  fs.mkdirSync(path.join(process.cwd(), "public"));
}

const output = fs.createWriteStream(path.join(process.cwd(), "public", "rory-source.zip"));
const archive = new archiver.ZipArchive({ zlib: { level: 9 } });

output.on("close", () => {
  console.log(archive.pointer() + " total bytes");
  console.log("archiver has been finalized and the output file descriptor has closed.");
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);

archive.glob("**/*", {
  cwd: process.cwd(),
  ignore: ["node_modules/**", "dist/**", ".git/**", "public/rory-source.zip", ".env"]
});

archive.finalize();
