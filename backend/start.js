import { execSync } from "child_process";

// Run migrations first (prisma migrate deploy) only if DATABASE_URL is present.
// This prevents deploys from failing during preview builds or if the env var
// wasn't set yet. In production you should set DATABASE_URL in Render.
try {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn(
      "DATABASE_URL not set — skipping prisma migrate deploy. Set DATABASE_URL in your environment to run migrations on deploy."
    );
  } else {
    console.log("Running prisma migrations: npx prisma migrate deploy");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
  }
} catch (err) {
  console.error(
    "Error running migrations:",
    err && err.message ? err.message : err
  );
  // Do not hard-fail; allow process to continue so the server can start and you
  // can inspect logs. If you want to fail the deploy on migration error,
  // uncomment the following line:
  // process.exit(1);
}

// Start the server by importing the server module (server.js calls app.listen)
console.log("Starting server module...");
import("./server.js")
  .then(() => console.log("Server module loaded."))
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
