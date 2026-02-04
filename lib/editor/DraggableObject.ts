/**
 * 可拖放物件系統
 * 支援拖放、網格吸附、碰撞檢測
 */

import * as PIXI from 'pixi.js';
import { toIsometric } from '@/lib/isometric';

export interface DraggableObjectConfig {
  sprite: PIXI.Container;
  gridX: number;
  gridY: number;
  gridSize?: number;
  snapToGrid?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (gridX: number, gridY: number) => void;
  onDragMove?: (gridX: number, gridY: number) => void;
}

export class DraggableObject {
  public sprite: PIXI.Container;
  private isDragging: boolean = false;
  private dragOffset: { x: number; y: number } = { x: 0, y: 0 };
  private gridSize: number;
  private snapToGrid: boolean;
  private currentGridX: number;
  private currentGridY: number;
  
  private onDragStart?: () => void;
  private onDragEnd?: (gridX: number, gridY: number) => void;
  private onDragMove?: (gridX: number, gridY: number) => void;
  
  constructor(config: DraggableObjectConfig) {
    this.sprite = config.sprite;
    this.gridSize = config.gridSize || 64;
    this.snapToGrid = config.snapToGrid !== false;
    this.currentGridX = config.gridX;
    this.currentGridY = config.gridY;
    
    this.onDragStart = config.onDragStart;
    this.onDragEnd = config.onDragEnd;
    this.onDragMove = config.onDragMove;
    
    this.setupInteractivity();
  }
  
  private setupInteractivity() {
    this.sprite.eventMode = 'static';
    this.sprite.cursor = 'pointer';
    
    // 滑鼠按下
    this.sprite.on('pointerdown', (event: PIXI.FederatedPointerEvent) => {
      this.isDragging = true;
      const position = event.global;
      this.dragOffset = {
        x: position.x - this.sprite.position.x,
        y: position.y - this.sprite.position.y
      };
      
      // 提升層級
      if (this.sprite.parent) {
        this.sprite.parent.setChildIndex(this.sprite, this.sprite.parent.children.length - 1);
      }
      
      // 視覺回饋
      this.sprite.alpha = 0.7;
      this.sprite.scale.set(1.1);
      
      if (this.onDragStart) {
        this.onDragStart();
      }
    });
    
    // 滑鼠移動
    this.sprite.on('pointermove', (event: PIXI.FederatedPointerEvent) => {
      if (this.isDragging) {
        const position = event.global;
        const newX = position.x - this.dragOffset.x;
        const newY = position.y - this.dragOffset.y;
        
        if (this.snapToGrid) {
          // 轉換回網格座標
          const gridPos = this.screenToGrid(newX, newY);
          this.currentGridX = gridPos.gridX;
          this.currentGridY = gridPos.gridY;
          
          // 吸附到網格
          const isoPos = toIsometric(this.currentGridX, this.currentGridY);
          this.sprite.position.set(isoPos.isoX, isoPos.isoY);
          
          if (this.onDragMove) {
            this.onDragMove(this.currentGridX, this.currentGridY);
          }
        } else {
          this.sprite.position.set(newX, newY);
        }
      }
    });
    
    // 滑鼠放開
    this.sprite.on('pointerup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        
        // 恢復視覺
        this.sprite.alpha = 1;
        this.sprite.scale.set(1);
        
        if (this.onDragEnd) {
          this.onDragEnd(this.currentGridX, this.currentGridY);
        }
      }
    });
    
    this.sprite.on('pointerupoutside', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.sprite.alpha = 1;
        this.sprite.scale.set(1);
        
        if (this.onDragEnd) {
          this.onDragEnd(this.currentGridX, this.currentGridY);
        }
      }
    });
  }
  
  /**
   * 螢幕座標轉網格座標（等距投影反轉）
   */
  private screenToGrid(screenX: number, screenY: number): { gridX: number; gridY: number } {
    // 等距投影反轉公式
    // 假設 tileWidth = 64, tileHeight = 32
    const tileWidth = 64;
    const tileHeight = 32;
    
    const gridX = (screenX / (tileWidth / 2) + screenY / (tileHeight / 2)) / 2;
    const gridY = (screenY / (tileHeight / 2) - screenX / (tileWidth / 2)) / 2;
    
    return {
      gridX: Math.round(gridX),
      gridY: Math.round(gridY)
    };
  }
  
  /**
   * 設定網格位置
   */
  public setGridPosition(gridX: number, gridY: number) {
    this.currentGridX = gridX;
    this.currentGridY = gridY;
    const isoPos = toIsometric(gridX, gridY);
    this.sprite.position.set(isoPos.isoX, isoPos.isoY);
  }
  
  /**
   * 取得當前網格位置
   */
  public getGridPosition(): { gridX: number; gridY: number } {
    return {
      gridX: this.currentGridX,
      gridY: this.currentGridY
    };
  }
  
  /**
   * 啟用/停用拖放
   */
  public setDraggable(enabled: boolean) {
    this.sprite.eventMode = enabled ? 'static' : 'none';
    this.sprite.cursor = enabled ? 'pointer' : 'default';
  }
  
  /**
   * 銷毀
   */
  public destroy() {
    this.sprite.removeAllListeners();
  }
}
