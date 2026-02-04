/**
 * 等距視角座標轉換工具
 * 
 * 開羅遊戲風格的等距（Isometric）視角
 */

export const TILE_WIDTH = 64;   // 地板磚寬度
export const TILE_HEIGHT = 32;  // 地板磚高度

export interface Point2D {
  x: number;
  y: number;
}

export interface IsometricPoint {
  isoX: number;
  isoY: number;
}

/**
 * 2D 網格座標 → 等距螢幕座標
 */
export function toIsometric(x: number, y: number): IsometricPoint {
  return {
    isoX: (x - y) * (TILE_WIDTH / 2),
    isoY: (x + y) * (TILE_HEIGHT / 2)
  };
}

/**
 * 等距螢幕座標 → 2D 網格座標
 */
export function fromIsometric(isoX: number, isoY: number): Point2D {
  const x = (isoX / (TILE_WIDTH / 2) + isoY / (TILE_HEIGHT / 2)) / 2;
  const y = (isoY / (TILE_HEIGHT / 2) - isoX / (TILE_WIDTH / 2)) / 2;
  
  return { x, y };
}

/**
 * 深度排序（用於渲染順序）
 * 遠的在後，近的在前
 */
export function sortByDepth<T extends { x: number; y: number }>(
  objects: T[]
): T[] {
  return objects.sort((a, b) => {
    return (a.x + a.y) - (b.x + b.y);
  });
}

/**
 * 計算物件在等距視角中的 Z 軸高度
 */
export function calculateZIndex(x: number, y: number): number {
  return Math.floor((x + y) * 100);
}

/**
 * 獲取地板磚的頂點座標（用於點擊檢測）
 */
export function getTileVertices(gridX: number, gridY: number): Point2D[] {
  const center = toIsometric(gridX, gridY);
  
  return [
    { x: center.isoX, y: center.isoY - TILE_HEIGHT / 2 }, // 上
    { x: center.isoX + TILE_WIDTH / 2, y: center.isoY },  // 右
    { x: center.isoX, y: center.isoY + TILE_HEIGHT / 2 }, // 下
    { x: center.isoX - TILE_WIDTH / 2, y: center.isoY }   // 左
  ];
}

/**
 * 點是否在等距地板磚內（點擊檢測）
 */
export function isPointInTile(
  point: Point2D,
  gridX: number,
  gridY: number
): boolean {
  const vertices = getTileVertices(gridX, gridY);
  
  // 使用射線法檢測
  let inside = false;
  
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x;
    const yi = vertices[i].y;
    const xj = vertices[j].x;
    const yj = vertices[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y))
      && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}
