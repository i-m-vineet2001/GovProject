#!/usr/bin/env node
import { spawn } from "child_process";
import path from "path";

// Delegate to backend/start.js so Render (or any host) can run `node start.js`
const backendStart = path.join(process.cwd(), "backend", "start.js");
console.log(`Delegating to ${backendStart}`);

const child = spawn(process.execPath, [backendStart], { stdio: "inherit" });

child.on("exit", (code, signal) => {
  if (signal) {
    console.log(`Process terminated with signal ${signal}`);
    process.kill(process.pid, signal);
  }
  process.exit(code ?? 0);
});
