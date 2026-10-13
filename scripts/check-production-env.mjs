#!/usr/bin/env node

const required = [
  "DATABASE_URL",
  "BETTER_AUTH_URL",
  "BETTER_AUTH_SECRET",
  "GROK_AUTH_ISSUER",
  "GROK_AUTH_CLIENT_ID",
  "GROK_AUTH_CLIENT_SECRET",
];

const missing = required.filter((key) => !process.env[key]?.trim());
const authEnabled = process.env.VITE_AUTH_ENABLED?.trim().toLowerCase();

if (authEnabled === "false") {
  console.error("[production-env] VITE_AUTH_ENABLED must not be false in production.");
  process.exit(1);
}

if (missing.length > 0) {
  console.error(`[production-env] Missing required variables: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(`[production-env] validated ${required.length} required variables.`);
