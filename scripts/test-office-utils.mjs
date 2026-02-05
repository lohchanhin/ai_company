import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const transpileModule = (modulePath) => {
  const source = fs.readFileSync(modulePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
    },
    fileName: modulePath,
  });

  const moduleExports = {};
  const moduleContext = {
    module: { exports: moduleExports },
    exports: moduleExports,
    require: (request) => {
      if (request.startsWith("@/")) {
        const resolvedPath = path.join(repoRoot, request.replace("@/", ""));
        const filePath = `${resolvedPath}.ts`;
        if (fs.existsSync(filePath)) {
          return transpileModule(filePath);
        }
        return transpileModule(path.join(resolvedPath, "index.ts"));
      }
      return require(request);
    },
  };

  vm.runInNewContext(transpiled.outputText, moduleContext, {
    filename: modulePath,
  });

  return moduleContext.module.exports;
};

const gridModulePath = path.join(repoRoot, "lib", "office", "grid.ts");
const zonesModulePath = path.join(repoRoot, "lib", "office", "zones.ts");

const { calculateGridFromVm } = transpileModule(gridModulePath);
const { generateZones } = transpileModule(zonesModulePath);

const vmSpec = {
  vCPU: 8,
  ramGB: 16,
  diskGB: 200,
  netMbps: 1000,
};

const grid = calculateGridFromVm(vmSpec);

assert.ok(grid.width > 0, "grid width should be positive");
assert.ok(grid.height > 0, "grid height should be positive");
assert.equal(grid.tileW, 64);
assert.equal(grid.tileH, 32);

const zones = generateZones(grid);
const zoneTypes = zones.map((zone) => zone.type);

for (const zone of zones) {
  assert.ok(zone.rect.w > 0, `${zone.id} width should be positive`);
  assert.ok(zone.rect.h > 0, `${zone.id} height should be positive`);
  assert.ok(zone.rect.x >= 0, `${zone.id} x should be non-negative`);
  assert.ok(zone.rect.y >= 0, `${zone.id} y should be non-negative`);
  assert.ok(
    zone.rect.x + zone.rect.w <= grid.width,
    `${zone.id} should fit within grid width`
  );
  assert.ok(
    zone.rect.y + zone.rect.h <= grid.height,
    `${zone.id} should fit within grid height`
  );
}

assert.ok(zoneTypes.includes("work"), "zones should include work area");
assert.ok(zoneTypes.includes("meet"), "zones should include meet area");
assert.ok(zoneTypes.includes("rest"), "zones should include rest area");
assert.ok(zoneTypes.includes("admin"), "zones should include admin area");
assert.ok(zoneTypes.includes("walkway"), "zones should include walkway area");

console.log("Office utils tests passed.");
