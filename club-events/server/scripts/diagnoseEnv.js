/**
 * Diagnostic only — never prints the actual private key or password.
 * Checks the SHAPE of your Firebase credentials in server/.env so we can
 * tell a formatting mistake apart from a genuinely invalid/revoked key.
 *
 * Usage (from the server/ folder): node scripts/diagnoseEnv.js
 */
import dotenv from "dotenv";
dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawKey = process.env.FIREBASE_PRIVATE_KEY;

console.log("--- FIREBASE_PROJECT_ID ---");
console.log("present:", Boolean(projectId));
console.log("value (safe to show):", projectId);
console.log("looks like a placeholder:", projectId === "your-project-id");

console.log("\n--- FIREBASE_CLIENT_EMAIL ---");
console.log("present:", Boolean(clientEmail));
console.log(
  "ends with .iam.gserviceaccount.com:",
  Boolean(clientEmail?.endsWith(".iam.gserviceaccount.com")),
);
console.log("value (safe to show):", clientEmail);

console.log(
  "\n--- FIREBASE_PRIVATE_KEY (structure only, never the actual key) ---",
);
console.log("present:", Boolean(rawKey));
if (rawKey) {
  console.log("length (chars):", rawKey.length);
  console.log(
    "starts with -----BEGIN PRIVATE KEY-----:",
    rawKey.startsWith("-----BEGIN PRIVATE KEY-----"),
  );
  console.log(
    "ends with -----END PRIVATE KEY-----\\n (literal backslash-n):",
    rawKey.endsWith("-----END PRIVATE KEY-----\n"),
  );
  console.log(
    "contains literal two-character \\n sequences:",
    rawKey.includes("\\n"),
  );
  console.log(
    "contains REAL newline characters already (should be false if .env stores it as \\n):",
    /\r|\n/.test(rawKey.replace(/\\n/g, "")),
  );
  const literalBackslashNCount = (rawKey.match(/\\n/g) || []).length;
  console.log(
    "count of literal \\n sequences found:",
    literalBackslashNCount,
    "(a typical key has 25-30)",
  );
}
