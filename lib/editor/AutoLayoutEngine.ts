/**
 * 自動佈局系統
 * 根據 VPS 數量智能排列工位和家具
 */

import { SceneObject } from '../scene-config';

export interface LayoutZone {
  name: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  type: 'workstation' | 'meeting' | 'break' | 'management';
  floorType: 'blue-carpet' | 'gray-carpet' | 'green-carpet' | 'red-carpet' | 'wood-floor';
}

export interface AutoLayoutConfig {
  gridWidth: number; // 網格寬度
  gridHeight: number; // 網格高度
  vpsCount: number; // VPS 數量
  includeCommonAreas?: boolean; // 是否包含公共區域
  workstationSpacing?: number; // 工位間距
}

export class AutoLayoutEngine {
  
  /**
   * 根據 VPS 數量生成完整辦公室佈局
   */
  public static generateLayout(config: AutoLayoutConfig): SceneObject[] {
    const {
      gridWidth = 8,
      gridHeight = 8,
      vpsCount,
      includeCommonAreas = true,
      workstationSpacing = 2
    } = config;
    
    const objects: SceneObject[] = [];
    
    // 計算區域分配
    const zones = this.calculateZones(gridWidth, gridHeight, vpsCount, includeCommonAreas);
    
    // 生成各區域物件
    zones.forEach(zone => {
      switch (zone.type) {
        case 'workstation':
          objects.push(...this.generateWorkstations(zone, vpsCount, workstationSpacing));
          break;
        case 'meeting':
          if (includeCommonAreas) {
            objects.push(...this.generateMeetingArea(zone));
          }
          break;
        case 'break':
          if (includeCommonAreas) {
            objects.push(...this.generateBreakArea(zone));
          }
          break;
        case 'management':
          if (includeCommonAreas) {
            objects.push(...this.generateManagementArea(zone));
          }
          break;
      }
    });
    
    return objects;
  }
  
  /**
   * 計算區域分配
   */
  private static calculateZones(
    gridWidth: number, 
    gridHeight: number, 
    vpsCount: number,
    includeCommonAreas: boolean
  ): LayoutZone[] {
    const zones: LayoutZone[] = [];
    
    if (!includeCommonAreas) {
      // 全部作為工作區
      zones.push({
        name: '工作區',
        startX: 0,
        startY: 0,
        endX: gridWidth - 1,
        endY: gridHeight - 1,
        type: 'workstation',
        floorType: 'blue-carpet'
      });
      return zones;
    }
    
    // 根據 VPS 數量動態分配區域
    if (vpsCount <= 4) {
      // 小型辦公室（4 人以下）
      zones.push({
        name: '工作區',
        startX: 0,
        startY: 0,
        endX: gridWidth - 1,
        endY: Math.floor(gridHeight * 0.6),
        type: 'workstation',
        floorType: 'blue-carpet'
      });
      
      zones.push({
        name: '休息區',
        startX: 0,
        startY: Math.floor(gridHeight * 0.6) + 1,
        endX: gridWidth - 1,
        endY: gridHeight - 1,
        type: 'break',
        floorType: 'green-carpet'
      });
      
    } else if (vpsCount <= 8) {
      // 中型辦公室（5-8 人）
      zones.push({
        name: '工作區',
        startX: 0,
        startY: 0,
        endX: gridWidth - 1,
        endY: Math.floor(gridHeight * 0.5),
        type: 'workstation',
        floorType: 'blue-carpet'
      });
      
      zones.push({
        name: '會議區',
        startX: 0,
        startY: Math.floor(gridHeight * 0.5) + 1,
        endX: gridWidth - 1,
        endY: Math.floor(gridHeight * 0.7),
        type: 'meeting',
        floorType: 'gray-carpet'
      });
      
      zones.push({
        name: '休息區',
        startX: 0,
        startY: Math.floor(gridHeight * 0.7) + 1,
        endX: gridWidth - 1,
        endY: gridHeight - 1,
        type: 'break',
        floorType: 'green-carpet'
      });
      
    } else {
      // 大型辦公室（9+ 人）
      zones.push({
        name: '工作區',
        startX: 0,
        startY: 0,
        endX: gridWidth - 1,
        endY: Math.floor(gridHeight * 0.4),
        type: 'workstation',
        floorType: 'blue-carpet'
      });
      
      zones.push({
        name: '會議區',
        startX: 0,
        startY: Math.floor(gridHeight * 0.4) + 1,
        endX: gridWidth - 1,
        endY: Math.floor(gridHeight * 0.6),
        type: 'meeting',
        floorType: 'gray-carpet'
      });
      
      zones.push({
        name: '休息區',
        startX: 0,
        startY: Math.floor(gridHeight * 0.6) + 1,
        endX: gridWidth - 1,
        endY: Math.floor(gridHeight * 0.85),
        type: 'break',
        floorType: 'green-carpet'
      });
      
      zones.push({
        name: '管理區',
        startX: 0,
        startY: Math.floor(gridHeight * 0.85) + 1,
        endX: gridWidth - 1,
        endY: gridHeight - 1,
        type: 'management',
        floorType: 'red-carpet'
      });
    }
    
    return zones;
  }
  
  /**
   * 生成工位
   */
  private static generateWorkstations(
    zone: LayoutZone, 
    count: number, 
    spacing: number
  ): SceneObject[] {
    const objects: SceneObject[] = [];
    const zoneWidth = zone.endX - zone.startX + 1;
    const zoneHeight = zone.endY - zone.startY + 1;
    
    // 計算每排工位數
    const workstationsPerRow = Math.min(3, Math.ceil(Math.sqrt(count)));
    const rows = Math.ceil(count / workstationsPerRow);
    
    let workstationIndex = 0;
    
    for (let row = 0; row < rows && workstationIndex < count; row++) {
      const rowY = zone.startY + row * spacing;
      if (rowY > zone.endY) break;
      
      for (let col = 0; col < workstationsPerRow && workstationIndex < count; col++) {
        const colX = zone.startX + col * spacing + 1;
        if (colX > zone.endX) break;
        
        // 桌子
        objects.push({
          type: 'furniture',
          sprite: 'desk',
          gridX: colX,
          gridY: rowY + 0.5
        });
        
        // 椅子
        objects.push({
          type: 'furniture',
          sprite: 'chair',
          gridX: colX,
          gridY: rowY + 1
        });
        
        // 螢幕
        objects.push({
          type: 'object',
          sprite: 'object-monitor',
          gridX: colX,
          gridY: rowY + 0.3
        });
        
        // 鍵盤（間隔放置）
        if (workstationIndex % 2 === 0) {
          objects.push({
            type: 'object',
            sprite: 'object-keyboard',
            gridX: colX,
            gridY: rowY + 0.6
          });
        }
        
        workstationIndex++;
      }
    }
    
    // 裝飾物件
    if (zone.endX >= 6) {
      objects.push({
        type: 'object',
        sprite: 'plant-small',
        gridX: 0,
        gridY: zone.startY + 1
      });
      
      objects.push({
        type: 'furniture',
        sprite: 'printer',
        gridX: zone.endX - 1,
        gridY: zone.startY + 1
      });
    }
    
    return objects;
  }
  
  /**
   * 生成會議區
   */
  private static generateMeetingArea(zone: LayoutZone): SceneObject[] {
    const objects: SceneObject[] = [];
    const centerY = Math.floor((zone.startY + zone.endY) / 2);
    
    // 會議桌 1
    const table1X = Math.floor((zone.endX - zone.startX) / 3) + zone.startX;
    objects.push({
      type: 'furniture',
      sprite: 'meeting-table',
      gridX: table1X,
      gridY: centerY
    });
    
    // 椅子
    objects.push(
      { type: 'furniture', sprite: 'chair', gridX: table1X - 0.5, gridY: centerY },
      { type: 'furniture', sprite: 'chair', gridX: table1X + 0.5, gridY: centerY },
      { type: 'furniture', sprite: 'chair', gridX: table1X, gridY: centerY - 0.5 },
      { type: 'furniture', sprite: 'chair', gridX: table1X, gridY: centerY + 0.5 }
    );
    
    // 會議桌 2
    if (zone.endX - zone.startX >= 5) {
      const table2X = Math.floor((zone.endX - zone.startX) * 2 / 3) + zone.startX;
      objects.push({
        type: 'furniture',
        sprite: 'meeting-table',
        gridX: table2X,
        gridY: centerY
      });
      
      objects.push(
        { type: 'furniture', sprite: 'chair', gridX: table2X - 0.5, gridY: centerY },
        { type: 'furniture', sprite: 'chair', gridX: table2X + 0.5, gridY: centerY }
      );
    }
    
    // 裝飾
    objects.push(
      { type: 'object', sprite: 'whiteboard', gridX: zone.endX, gridY: centerY },
      { type: 'furniture', sprite: 'file-cabinet', gridX: zone.endX, gridY: zone.endY },
      { type: 'object', sprite: 'plant-medium', gridX: zone.startX, gridY: zone.endY }
    );
    
    return objects;
  }
  
  /**
   * 生成休息區
   */
  private static generateBreakArea(zone: LayoutZone): SceneObject[] {
    const objects: SceneObject[] = [];
    const centerY = Math.floor((zone.startY + zone.endY) / 2);
    
    // 沙發
    objects.push({
      type: 'object',
      sprite: 'sofa',
      gridX: zone.startX + 1,
      gridY: centerY
    });
    
    // 休息桌 + 咖啡機
    const tableX = Math.floor((zone.endX - zone.startX) / 2) + zone.startX;
    objects.push(
      { type: 'object', sprite: 'break-room-table', gridX: tableX, gridY: centerY },
      { type: 'object', sprite: 'coffee-machine', gridX: tableX + 0.5, gridY: centerY - 0.3 }
    );
    
    // 飲水機
    objects.push({
      type: 'furniture',
      sprite: 'water-dispenser',
      gridX: zone.endX - 2,
      gridY: centerY
    });
    
    // 書架
    objects.push({
      type: 'furniture',
      sprite: 'bookshelf',
      gridX: zone.endX,
      gridY: centerY
    });
    
    // 裝飾
    objects.push(
      { type: 'object', sprite: 'plant-large', gridX: zone.startX, gridY: centerY },
      { type: 'object', sprite: 'plant-medium', gridX: zone.endX - 1, gridY: zone.endY },
      { type: 'object', sprite: 'clock', gridX: tableX, gridY: zone.startY },
      { type: 'object', sprite: 'game-console', gridX: zone.startX + 2, gridY: zone.endY }
    );
    
    return objects;
  }
  
  /**
   * 生成管理區
   */
  private static generateManagementArea(zone: LayoutZone): SceneObject[] {
    const objects: SceneObject[] = [];
    const centerY = Math.floor((zone.startY + zone.endY) / 2);
    
    // CEO 辦公桌
    const ceoX = Math.floor((zone.endX - zone.startX) / 3) + zone.startX;
    objects.push(
      { type: 'furniture', sprite: 'desk', gridX: ceoX, gridY: centerY - 0.3 },
      { type: 'furniture', sprite: 'chair', gridX: ceoX, gridY: centerY + 0.3 },
      { type: 'object', sprite: 'object-monitor', gridX: ceoX, gridY: centerY - 0.5 }
    );
    
    // 第二辦公桌
    if (zone.endX - zone.startX >= 5) {
      const desk2X = Math.floor((zone.endX - zone.startX) * 2 / 3) + zone.startX;
      objects.push(
        { type: 'furniture', sprite: 'desk', gridX: desk2X, gridY: centerY - 0.3 },
        { type: 'furniture', sprite: 'chair', gridX: desk2X, gridY: centerY + 0.3 },
        { type: 'object', sprite: 'object-monitor', gridX: desk2X, gridY: centerY - 0.5 }
      );
    }
    
    // 裝飾
    objects.push(
      { type: 'object', sprite: 'plant-large', gridX: zone.startX + 1, gridY: centerY },
      { type: 'object', sprite: 'window', gridX: zone.startX, gridY: zone.startY },
      { type: 'object', sprite: 'door', gridX: zone.endX, gridY: centerY },
      { type: 'object', sprite: 'filing-cabinet', gridX: zone.endX, gridY: zone.endY },
      { type: 'furniture', sprite: 'file-cabinet', gridX: zone.endX - 1, gridY: zone.endY }
    );
    
    return objects;
  }
}
