import { build } from "vite";
import { copyFile, mkdir, rm, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = resolve(ROOT, "dist");

async function main() {
  // Clean
  if (existsSync(DIST)) {
    await rm(DIST, { recursive: true });
  }

  // 1. Build popup with Vite
  await build({
    root: ROOT,
    build: {
      outDir: DIST,
      emptyOutDir: false,
      rollupOptions: {
        input: resolve(ROOT, "src/popup/index.html"),
        output: {
          entryFileNames: "src/popup/index.js",
          assetFileNames: "assets/[name][extname]",
        },
      },
    },
  });

  // 2. Build background with Vite (separate build)
  await build({
    root: ROOT,
    build: {
      outDir: DIST,
      emptyOutDir: false,
      lib: {
        entry: resolve(ROOT, "src/background/index.ts"),
        formats: ["es"],
        fileName: () => "src/background/index.js",
      },
      rollupOptions: {
        external: [],
      },
    },
  });

  // 3. Copy manifest with updated service worker path for production
  const manifestSrc = await readFile(resolve(ROOT, "manifest.json"), "utf-8");
  const manifestProd = manifestSrc.replace(
    '"src/background/index.ts"',
    '"src/background/index.js"'
  );
  await mkdir(resolve(DIST, "src/icons"), { recursive: true });
  await writeFile(resolve(DIST, "manifest.json"), manifestProd);

  // 4. Copy icons
  for (const size of [16, 48, 128]) {
    await copyFile(
      resolve(ROOT, "src/icons", `icon-${size}.png`),
      resolve(DIST, "src/icons", `icon-${size}.png`)
    );
  }

  console.log("Build complete: dist/");
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
