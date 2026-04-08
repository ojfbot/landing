import { chromium } from "playwright";
import { projects } from "../src/components/Portfolio/projects.js";
import { resolve } from "node:path";

const VIEWPORT = { width: 1280, height: 720 };
const OUT_DIR = resolve(import.meta.dirname, "../public/previews");

const ids = process.argv.slice(2);
const targets =
  ids.length > 0
    ? projects.filter((p) => ids.includes(p.id))
    : projects.filter((p) => p.status === "live");

if (targets.length === 0) {
  console.error("No matching projects found.");
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEWPORT, colorScheme: "dark" });

for (const project of targets) {
  const path = resolve(OUT_DIR, `${project.id}.png`);
  const page = await context.newPage();
  console.log(`Capturing ${project.id} — ${project.url}`);
  try {
    await page.goto(project.url, { waitUntil: "networkidle", timeout: 30_000 });
    // For shell-hosted apps (?app=), wait for MF remote to load
    if (project.url.includes("?app=")) {
      await page.waitForSelector(".frame-fade-in", { timeout: 15_000 });
      await page.waitForTimeout(500); // let fade-in animation settle
    }
    await page.screenshot({ path, type: "png" });
    console.log(`  -> ${path}`);
  } catch (err) {
    console.error(`  !! Failed: ${(err as Error).message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`Done. ${targets.length} preview(s) captured.`);
