/**
 * 等距投影座標轉換工具
 */

const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

export interface IsometricPosition {
  isoX: number;
  isoY: number;
}

/**
 * 網格座標轉等距螢幕座標
 */
export function toIsometric(gridX: number, gridY: number): IsometricPosition {
  const isoX = (gridX - gridY) * (TILE_WIDTH / 2);
  const isoY = (gridX + gridY) * (TILE_HEIGHT / 2);
  
  return { isoX, isoY };
}

/**
 * 等距螢幕座標轉網格座標（反轉）
 */
export function toGrid(isoX: number, isoY: number): { gridX: number; gridY: number } {
  const gridX = (isoX / (TILE_WIDTH / 2) + isoY / (TILE_HEIGHT / 2)) / 2;
  const gridY = (isoY / (TILE_HEIGHT / 2) - isoX / (TILE_WIDTH / 2)) / 2;
  
  return {
    gridX: Math.round(gridX),
    gridY: Math.round(gridY)
  };
}
