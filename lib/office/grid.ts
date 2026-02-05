import type { GridSpec, VmSpec } from "@/types";

type GridCalcOptions = {
  minTiles?: number;
  maxTiles?: number;
  tileW?: number;
  tileH?: number;
  k?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const calculateGridFromVm = (
  vmSpec: VmSpec,
  options: GridCalcOptions = {}
): GridSpec => {
  const {
    minTiles = 200,
    maxTiles = 2000,
    tileW = 64,
    tileH = 32,
    k = 1.0,
  } = options;

  const cpuPts = vmSpec.vCPU * 10;
  const ramPts = vmSpec.ramGB * 3;
  const diskPts = Math.log2(vmSpec.diskGB + 1) * 8;
  const netPts = Math.log2(vmSpec.netMbps + 1) * 6;
  const totalPts = cpuPts + ramPts + diskPts + netPts;

  const tiles = clamp(Math.round(totalPts * k), minTiles, maxTiles);
  const aspect = clamp(1.2 + vmSpec.vCPU / 32, 1.2, 1.8);
  const width = Math.max(1, Math.round(Math.sqrt(tiles * aspect)));
  const height = Math.max(1, Math.round(tiles / width));

  return {
    width,
    height,
    tileW,
    tileH,
  };
};
