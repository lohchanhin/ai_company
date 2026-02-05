import { rm } from "node:fs/promises";
import { spawn } from "node:child_process";

const shouldCleanCache =
  process.env.CLEAN_NEXT_CACHE === "1" || process.argv.includes("--clean-cache");

if (shouldCleanCache) {
  await rm(".next/cache", { recursive: true, force: true });
  console.log("已清除 .next/cache");
}

const child = spawn("next", ["dev"], { stdio: "inherit", shell: true });

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
