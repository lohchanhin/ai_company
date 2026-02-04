/**
 * 完整辦公室環境配置
 * 僅包含環境裝飾，不含員工角色
 * 員工將根據 VPS 連線動態生成
 */

export interface SceneObject {
  type: 'furniture' | 'object' | 'floor';
  sprite: string;
  gridX: number;
  gridY: number;
  zOffset?: number;
  scale?: number;
}

// 完整辦公室環境配置（8×8 網格）
export const FULL_OFFICE_SCENE: SceneObject[] = [
  // ===== 開發區（藍色地板，Y=0-2）=====
  // 第一排工位（預留給 VPS 員工）
  { type: 'furniture', sprite: 'desk', gridX: 1, gridY: 0.5 },
  { type: 'furniture', sprite: 'chair', gridX: 1, gridY: 1 },
  { type: 'object', sprite: 'object-monitor', gridX: 1, gridY: 0.3 },
  { type: 'object', sprite: 'object-keyboard', gridX: 1, gridY: 0.6 },
  
  { type: 'furniture', sprite: 'desk', gridX: 3, gridY: 0.5 },
  { type: 'furniture', sprite: 'chair', gridX: 3, gridY: 1 },
  { type: 'object', sprite: 'object-monitor', gridX: 3, gridY: 0.3 },
  { type: 'object', sprite: 'object-keyboard', gridX: 3, gridY: 0.6 },
  
  { type: 'furniture', sprite: 'desk', gridX: 5, gridY: 0.5 },
  { type: 'furniture', sprite: 'chair', gridX: 5, gridY: 1 },
  { type: 'object', sprite: 'object-monitor', gridX: 5, gridY: 0.3 },
  
  // 第二排工位
  { type: 'furniture', sprite: 'desk', gridX: 1, gridY: 2.5 },
  { type: 'furniture', sprite: 'chair', gridX: 1, gridY: 3 },
  { type: 'object', sprite: 'object-keyboard', gridX: 1, gridY: 2.6 },
  
  { type: 'furniture', sprite: 'desk', gridX: 3, gridY: 2.5 },
  { type: 'furniture', sprite: 'chair', gridX: 3, gridY: 3 },
  { type: 'object', sprite: 'object-monitor', gridX: 3, gridY: 2.3 },
  
  { type: 'furniture', sprite: 'desk', gridX: 5, gridY: 2.5 },
  { type: 'furniture', sprite: 'chair', gridX: 5, gridY: 3 },
  { type: 'object', sprite: 'object-monitor', gridX: 5, gridY: 2.3 },
  
  // 開發區裝飾
  { type: 'object', sprite: 'plant-small', gridX: 0, gridY: 1 },
  { type: 'object', sprite: 'plant-small', gridX: 6.5, gridY: 0.5 },
  { type: 'object', sprite: 'trash-bin', gridX: 6.5, gridY: 2 },
  { type: 'furniture', sprite: 'printer', gridX: 7, gridY: 1 },
  { type: 'object', sprite: 'whiteboard', gridX: 0, gridY: 0 },
  { type: 'object', sprite: 'ceiling-lamp', gridX: 3, gridY: 1 },
  { type: 'object', sprite: 'wall-poster', gridX: 6, gridY: 0 },
  
  // ===== 會議區（灰色地板，Y=3-4）=====
  { type: 'furniture', sprite: 'meeting-table', gridX: 2, gridY: 3.5 },
  { type: 'furniture', sprite: 'chair', gridX: 1.5, gridY: 3.5 },
  { type: 'furniture', sprite: 'chair', gridX: 2.5, gridY: 3.5 },
  { type: 'furniture', sprite: 'chair', gridX: 2, gridY: 3 },
  { type: 'furniture', sprite: 'chair', gridX: 2, gridY: 4 },
  
  { type: 'furniture', sprite: 'meeting-table', gridX: 5, gridY: 3.5 },
  { type: 'furniture', sprite: 'chair', gridX: 4.5, gridY: 3.5 },
  { type: 'furniture', sprite: 'chair', gridX: 5.5, gridY: 3.5 },
  { type: 'furniture', sprite: 'chair', gridX: 5, gridY: 3 },
  { type: 'furniture', sprite: 'chair', gridX: 5, gridY: 4 },
  
  // 會議區裝飾
  { type: 'object', sprite: 'ceiling-lamp', gridX: 2, gridY: 3.5 },
  { type: 'object', sprite: 'ceiling-lamp', gridX: 5, gridY: 3.5 },
  { type: 'object', sprite: 'wall-poster', gridX: 0, gridY: 3.5 },
  { type: 'object', sprite: 'whiteboard', gridX: 7, gridY: 3.5 },
  { type: 'furniture', sprite: 'file-cabinet', gridX: 7, gridY: 4.5 },
  { type: 'object', sprite: 'plant-medium', gridX: 0, gridY: 4 },
  
  // ===== 休息區（綠色地板，Y=5-6）=====
  { type: 'object', sprite: 'sofa', gridX: 1, gridY: 5.5 },
  { type: 'object', sprite: 'sofa', gridX: 1, gridY: 6.5 },
  
  { type: 'object', sprite: 'break-room-table', gridX: 3, gridY: 5.5 },
  { type: 'object', sprite: 'coffee-machine', gridX: 3.5, gridY: 5.3 },
  
  { type: 'furniture', sprite: 'water-dispenser', gridX: 5, gridY: 5.5 },
  { type: 'furniture', sprite: 'bookshelf', gridX: 7, gridY: 5.5 },
  { type: 'furniture', sprite: 'bookshelf', gridX: 6.5, gridY: 6.5 },
  
  // 休息區裝飾
  { type: 'object', sprite: 'plant-large', gridX: 0, gridY: 5.5 },
  { type: 'object', sprite: 'plant-medium', gridX: 6, gridY: 6 },
  { type: 'object', sprite: 'plant-small', gridX: 4, gridY: 6.5 },
  { type: 'object', sprite: 'game-console', gridX: 2, gridY: 6.5 },
  { type: 'object', sprite: 'floor-lamp', gridX: 0.5, gridY: 6.5 },
  { type: 'object', sprite: 'clock', gridX: 4, gridY: 5 },
  { type: 'object', sprite: 'trash-bin', gridX: 5.5, gridY: 6.5 },
  
  // ===== 管理區（紅色地板，Y=7）=====
  // CEO 辦公室（預留給 VPS）
  { type: 'furniture', sprite: 'desk', gridX: 3, gridY: 7.3 },
  { type: 'furniture', sprite: 'chair', gridX: 3, gridY: 7.7 },
  { type: 'object', sprite: 'object-monitor', gridX: 3, gridY: 7.1 },
  { type: 'object', sprite: 'object-keyboard', gridX: 3, gridY: 7.4 },
  
  // 第二辦公桌
  { type: 'furniture', sprite: 'desk', gridX: 5.5, gridY: 7.3 },
  { type: 'furniture', sprite: 'chair', gridX: 5.5, gridY: 7.7 },
  { type: 'object', sprite: 'object-monitor', gridX: 5.5, gridY: 7.1 },
  
  // 管理區裝飾
  { type: 'object', sprite: 'plant-large', gridX: 1, gridY: 7.5 },
  { type: 'object', sprite: 'plant-medium', gridX: 7, gridY: 7 },
  { type: 'object', sprite: 'filing-cabinet', gridX: 7, gridY: 7.8 },
  { type: 'object', sprite: 'window', gridX: 0, gridY: 7 },
  { type: 'object', sprite: 'door', gridX: 7.5, gridY: 7.5 },
  { type: 'object', sprite: 'box', gridX: 1.5, gridY: 7.8 },
  { type: 'furniture', sprite: 'file-cabinet', gridX: 6, gridY: 7.8 },
  { type: 'object', sprite: 'ceiling-lamp', gridX: 4, gridY: 7.5 },
];

// 移除 CHARACTER_SPRITES（員工將動態生成）

// 家具精靈路徑映射
export const FURNITURE_SPRITES: Record<string, string> = {
  'desk': 'sprites/furniture/desk.png',
  'chair': 'sprites/furniture/chair.png',
  'meeting-table': 'sprites/furniture/meeting-table.png',
  'file-cabinet': 'sprites/furniture/file-cabinet.png',
  'bookshelf': 'sprites/furniture/bookshelf.png',
  'water-dispenser': 'sprites/furniture/water-dispenser.png',
  'printer': 'sprites/furniture/printer.png',
};

// 物件精靈路徑映射
export const OBJECT_SPRITES: Record<string, string> = {
  'plant-small': 'sprites/objects/plant-small.png',
  'plant-medium': 'sprites/objects/plant-medium.png',
  'plant-large': 'sprites/objects/plant-large.png',
  'sofa': 'sprites/objects/sofa.png',
  'ceiling-lamp': 'sprites/objects/ceiling-lamp.png',
  'window': 'sprites/objects/window.png',
  'object-keyboard': 'sprites/objects/object-keyboard.png',
  'object-monitor': 'sprites/objects/object-monitor.png',
  'clock': 'sprites/objects/clock.png',
  'coffee-machine': 'sprites/objects/coffee-machine.png',
  'door': 'sprites/objects/door.png',
  'filing-cabinet': 'sprites/objects/filing-cabinet.png',
  'floor-lamp': 'sprites/objects/floor-lamp.png',
  'game-console': 'sprites/objects/game-console.png',
  'box': 'sprites/objects/box.png',
  'break-room-table': 'sprites/objects/break-room-table.png',
  'trash-bin': 'sprites/objects/trash-bin.png',
  'wall-poster': 'sprites/objects/wall-poster.png',
  'whiteboard': 'sprites/objects/whiteboard.png',
};

// 地板精靈路徑映射
export const FLOOR_SPRITES: Record<string, string> = {
  'wood-floor': 'sprites/floors/wood-floor.png',
  'blue-carpet': 'sprites/floors/blue-carpet.png',
  'gray-carpet': 'sprites/floors/gray-carpet.png',
  'green-carpet': 'sprites/floors/green-carpet.png',
  'red-carpet': 'sprites/floors/red-carpet.png',
};
