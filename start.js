#!/usr/bin/env node
import { spawn, execSync } from "child_process";
import path from "path";
import fs from "fs";

// Ensure backend dependencies are installed before delegating. Some hosts
// may run start before postinstall completes — perform a safe check and
// run `npm install` in backend if node_modules/express is missing.
const backendDir = path.join(process.cwd(), "backend");
const expressMarker = path.join(backendDir, "node_modules", "express");
try {
  if (!fs.existsSync(expressMarker)) {
    console.log(
      "Backend dependencies missing — running npm install in backend..."
    );
    execSync("npm install", { stdio: "inherit", cwd: backendDir });
  }
} catch (err) {
  console.error(
    "Failed to install backend dependencies:",
    err && err.message ? err.message : err
  );
  // continue — the next step may still work or Render logs will show the error
}

// Delegate to backend/start.js so Render (or any host) can run `node start.js`
const backendStart = path.join(backendDir, "start.js");
console.log(`Delegating to ${backendStart}`);

const child = spawn(process.execPath, [backendStart], { stdio: "inherit" });

child.on("exit", (code, signal) => {
  if (signal) {
    console.log(`Process terminated with signal ${signal}`);
    process.kill(process.pid, signal);
  }
  process.exit(code ?? 0);
});
