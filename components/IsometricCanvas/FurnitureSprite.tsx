'use client';

import * as PIXI from 'pixi.js';
import { toIsometric } from '@/lib/isometric';

export class FurnitureSprite {
  public graphics: PIXI.Graphics;
  private gridX: number;
  private gridY: number;
  
  constructor(
    type: 'desk' | 'chair' | 'plant' | 'bookshelf' | 'water-dispenser',
    gridX: number,
    gridY: number
  ) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.graphics = new PIXI.Graphics();
    
    const iso = toIsometric(gridX, gridY);
    this.graphics.position.set(iso.isoX, iso.isoY);
    
    this.draw(type);
  }
  
  private draw(type: string) {
    this.graphics.clear();
    
    switch (type) {
      case 'desk':
        // 辦公桌（棕色矩形）
        this.graphics.rect(-16, -8, 32, 4);
        this.graphics.fill(0x8B4513); // 桌面
        
        this.graphics.rect(-14, -6, 4, 10);
        this.graphics.fill(0x654321); // 左腿
        
        this.graphics.rect(10, -6, 4, 10);
        this.graphics.fill(0x654321); // 右腿
        break;
        
      case 'chair':
        // 椅子（深灰色）
        this.graphics.rect(-6, -4, 12, 8);
        this.graphics.fill(0x2C3E50); // 座位
        
        this.graphics.rect(-6, -8, 12, 4);
        this.graphics.fill(0x34495E); // 靠背
        break;
        
      case 'plant':
        // 植物（綠色）
        this.graphics.rect(-4, 0, 8, 8);
        this.graphics.fill(0x8B4513); // 花盆
        
        this.graphics.circle(0, -6, 8);
        this.graphics.fill(0x27AE60); // 葉子
        break;
        
      case 'bookshelf':
        // 書架（木色）
        this.graphics.rect(-12, -20, 24, 30);
        this.graphics.fill(0x8B4513);
        
        this.graphics.moveTo(-12, -10);
        this.graphics.lineTo(12, -10);
        this.graphics.moveTo(-12, 0);
        this.graphics.lineTo(12, 0);
        this.graphics.stroke({ width: 2, color: 0xA0522D });
        break;
        
      case 'water-dispenser':
        // 飲水機（藍色）
        this.graphics.rect(-8, -15, 16, 20);
        this.graphics.fill(0x3498DB);
        
        this.graphics.rect(-8, -18, 16, 3);
        this.graphics.fill(0x2980B9);
        
        // 紅藍按鈕
        this.graphics.circle(-4, -5, 2);
        this.graphics.fill(0xE74C3C);
        
        this.graphics.circle(4, -5, 2);
        this.graphics.fill(0x3498DB);
        break;
    }
  }
  
  public destroy() {
    if (this.graphics) {
      this.graphics.destroy();
    }
  }
}
