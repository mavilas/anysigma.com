#!/usr/bin/env node
/**
 * Export PDF using headless Chrome's --print-to-pdf flag.
 * Respects the page's @media print CSS (landscape A4, page breaks per Section).
 *
 * Usage: pnpm pdf [--page=launch-plan] [--out=Wonderful-Japan-Launch-Plan.pdf]
 *
 * Requires a local dev server running (pnpm dev) OR a deployed URL.
 * By default targets http://localhost:4326 — adjust PORT if dev moved it.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, statSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// ---- args ----
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  })
);
const PAGE = args.page || "launch-plan";
const PORT = args.port || process.env.PORT || "4326";
const URL = args.url || `http://localhost:${PORT}/${PAGE}`;
const OUT = args.out || `${PAGE === "launch-plan" ? "Wonderful-Japan-Launch-Plan" : PAGE}.pdf`;
const OUT_DIR = resolve(repoRoot, "exports");
const OUT_PATH = resolve(OUT_DIR, OUT);
// Also drop into public/ so the dev server / static build serves it
const PUBLIC_DIR = resolve(repoRoot, "public");
const PUBLIC_PATH = resolve(PUBLIC_DIR, OUT);

// ---- locate Chrome ----
const candidates = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];
const CHROME = candidates.find((p) => existsSync(p));
if (!CHROME) {
  console.error("✗ Could not locate Chrome. Install Google Chrome or Chromium.");
  process.exit(1);
}

// ---- ensure output dir ----
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

console.log(`→ Source URL: ${URL}`);
console.log(`→ Output    : ${OUT_PATH}`);
console.log(`→ Chrome    : ${CHROME.replace(/^\/Applications\/(.+?)\.app.*/, "$1")}`);
console.log("");

const chromeArgs = [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--hide-scrollbars",
  "--no-pdf-header-footer",
  "--virtual-time-budget=8000",
  "--run-all-compositor-stages-before-draw",
  `--print-to-pdf=${OUT_PATH}`,
  URL,
];

const child = spawn(CHROME, chromeArgs, { stdio: ["ignore", "inherit", "pipe"] });
let stderr = "";
child.stderr.on("data", (d) => (stderr += d.toString()));
child.on("close", (code) => {
  if (code !== 0) {
    console.error(`✗ Chrome exited with code ${code}`);
    if (stderr) console.error(stderr.split("\n").slice(-10).join("\n"));
    process.exit(code);
  }
  if (!existsSync(OUT_PATH)) {
    console.error(`✗ PDF not generated at ${OUT_PATH}`);
    process.exit(1);
  }
  const { size } = statSync(OUT_PATH);
  console.log(`✓ Generated PDF — ${(size / 1024).toFixed(0)} KB`);
  console.log(`  ${OUT_PATH}`);
  // Mirror into public/ so the button on the page can serve it
  try {
    if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });
    copyFileSync(OUT_PATH, PUBLIC_PATH);
    console.log(`✓ Mirrored to public/ — accessible at /${OUT}`);
  } catch (err) {
    console.warn(`  (mirror failed: ${err.message})`);
  }
});
