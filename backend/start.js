import { execSync } from "child_process";

// Run migrations first (safe in production: prisma migrate deploy)
try {
  console.log("Running prisma migrations: npx prisma migrate deploy");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} catch (err) {
  console.error(
    "Error running migrations:",
    err && err.message ? err.message : err
  );
  process.exit(1);
}

// Start the server by importing the server module (server.js calls app.listen)
console.log("Starting server module...");
import("./server.js")
  .then(() => console.log("Server module loaded."))
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
