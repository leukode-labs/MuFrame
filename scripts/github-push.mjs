#!/usr/bin/env node
/**
 * Pushes MuFrame source files to GitHub via the Git Data API.
 * Creates blobs → tree → commit → updates ref in one atomic operation.
 * Usage: node scripts/github-push.mjs [commit message]
 */
import fs from "fs";
import path from "path";

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "leukode-labs";
const REPO = "MuFrame";
const BRANCH = "main";
const ROOT = path.resolve(import.meta.dirname, "..");
const MSG = process.argv[2] || "Update from Replit workspace";

// Source paths to include (no node_modules, dist, caches)
const INCLUDE_ROOTS = [
  "artifacts/uomo-ecommerce/src",
  "artifacts/uomo-ecommerce/public",
  "artifacts/uomo-ecommerce/package.json",
  "artifacts/uomo-ecommerce/tsconfig.json",
  "artifacts/uomo-ecommerce/vite.config.ts",
  "artifacts/uomo-ecommerce/index.html",
  "artifacts/uomo-ecommerce/components.json",
  "artifacts/api-server/src",
  "artifacts/api-server/package.json",
  "artifacts/api-server/tsconfig.json",
  "artifacts/api-server/build.mjs",
  "lib/api-client-react",
  "lib/api-spec",
  "lib/api-zod",
  "lib/db",
  "scripts/github-push.mjs",
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "tsconfig.json",
  "replit.md",
  ".gitignore",
];

const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".replit-artifact", ".git"]);
const SKIP_EXT = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp",
  ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".glb", ".gltf", ".mp4", ".mp3", ".wav",
  ".pdf", ".zip", ".tar", ".gz",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, endpoint, body, retries = 5) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`https://api.github.com${endpoint}`, {
      method,
      headers: {
        Authorization: `token ${TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (res.status === 403 && data.message?.includes("secondary rate limit")) {
      const wait = Math.pow(2, attempt + 1) * 6000;
      process.stdout.write(` [rate-limited ${wait / 1000}s]`);
      await sleep(wait);
      continue;
    }
    return { status: res.status, data };
  }
  throw new Error("Rate limit retries exhausted");
}

function collectFiles(entryRel) {
  const full = path.join(ROOT, entryRel);
  if (!fs.existsSync(full)) return [];
  const stat = fs.statSync(full);
  if (stat.isFile()) {
    if (SKIP_EXT.has(path.extname(full).toLowerCase())) return [];
    return [{ fullPath: full, repoPath: entryRel.replace(/\\/g, "/") }];
  }
  const results = [];
  for (const entry of fs.readdirSync(full)) {
    if (SKIP_DIRS.has(entry)) continue;
    results.push(...collectFiles(path.join(entryRel, entry)));
  }
  return results;
}

async function run() {
  if (!TOKEN) { console.error("GITHUB_TOKEN required"); process.exit(1); }

  console.log("Collecting source files...");
  const files = [];
  for (const root of INCLUDE_ROOTS) files.push(...collectFiles(root));
  console.log(`Found ${files.length} files\n`);

  // Get HEAD commit and base tree
  const { status: refStatus, data: refData } = await api("GET", `/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
  let parentSha = null, baseTreeSha = null;
  if (refStatus === 200) {
    parentSha = refData.object.sha;
    const { data: cd } = await api("GET", `/repos/${OWNER}/${REPO}/git/commits/${parentSha}`);
    baseTreeSha = cd.tree.sha;
    console.log(`HEAD: ${parentSha.slice(0, 8)} (tree: ${baseTreeSha.slice(0, 8)})`);
  } else {
    console.log("No branch found — will create initial commit");
  }

  // Create blobs with throttling (150ms between each = ~400 blobs/min, safe for GitHub)
  console.log("\nCreating blobs:");
  const treeItems = [];
  for (let i = 0; i < files.length; i++) {
    const { fullPath, repoPath } = files[i];
    process.stdout.write(`\r  [${i + 1}/${files.length}] ${repoPath.slice(-65).padEnd(65)}`);
    const content = fs.readFileSync(fullPath, "utf8");
    const { data } = await api("POST", `/repos/${OWNER}/${REPO}/git/blobs`, {
      content: Buffer.from(content, "utf8").toString("base64"),
      encoding: "base64",
    });
    if (data.sha) {
      treeItems.push({ path: repoPath, mode: "100644", type: "blob", sha: data.sha });
    } else {
      console.error(`\n  WARN: no SHA for ${repoPath}`);
    }
    await sleep(150);
  }
  console.log(`\n${treeItems.length}/${files.length} blobs created\n`);

  if (treeItems.length === 0) { console.error("No blobs created — aborting"); process.exit(1); }

  // Create tree
  process.stdout.write("Creating tree... ");
  const treeBody = { tree: treeItems };
  if (baseTreeSha) treeBody.base_tree = baseTreeSha;
  const { data: treeData } = await api("POST", `/repos/${OWNER}/${REPO}/git/trees`, treeBody);
  console.log(`${treeData.sha?.slice(0, 8)}`);

  // Create commit
  process.stdout.write("Creating commit... ");
  const commitBody = {
    message: MSG,
    tree: treeData.sha,
    author: { name: "Replit Agent", email: "agent@replit.com", date: new Date().toISOString() },
  };
  if (parentSha) commitBody.parents = [parentSha];
  const { data: commitData } = await api("POST", `/repos/${OWNER}/${REPO}/git/commits`, commitBody);
  console.log(`${commitData.sha?.slice(0, 8)}`);

  // Update or create branch ref
  process.stdout.write("Updating branch ref... ");
  if (parentSha) {
    await api("PATCH", `/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, { sha: commitData.sha });
  } else {
    await api("POST", `/repos/${OWNER}/${REPO}/git/refs`, { ref: `refs/heads/${BRANCH}`, sha: commitData.sha });
  }
  console.log("done!");
  console.log(`\nAll ${treeItems.length} files at: https://github.com/${OWNER}/${REPO}/tree/${BRANCH}`);
}

run().catch(console.error);
