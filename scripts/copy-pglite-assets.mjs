#!/usr/bin/env node

import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules/@electric-sql/pglite/dist");
const destination = join(root, ".vercel/output/functions/__server.func/_libs");
const assets = ["pglite.data", "pglite.wasm", "initdb.wasm"];

await mkdir(destination, { recursive: true });
for (const asset of assets) {
  await copyFile(join(source, asset), join(destination, asset));
}
console.log(`[build] copied ${assets.length} PGlite runtime assets`);
