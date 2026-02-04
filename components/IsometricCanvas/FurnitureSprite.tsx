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
        this.graphics.beginFill(0x8B4513);
        this.graphics.drawRect(-16, -8, 32, 4); // 桌面
        this.graphics.endFill();
        this.graphics.beginFill(0x654321);
        this.graphics.drawRect(-14, -6, 4, 10); // 左腿
        this.graphics.drawRect(10, -6, 4, 10);  // 右腿
        this.graphics.endFill();
        break;
        
      case 'chair':
        // 椅子（深灰色）
        this.graphics.beginFill(0x2C3E50);
        this.graphics.drawRect(-6, -4, 12, 8); // 座位
        this.graphics.endFill();
        this.graphics.beginFill(0x34495E);
        this.graphics.drawRect(-6, -8, 12, 4); // 靠背
        this.graphics.endFill();
        break;
        
      case 'plant':
        // 植物（綠色）
        this.graphics.beginFill(0x8B4513);
        this.graphics.drawRect(-4, 0, 8, 8); // 花盆
        this.graphics.endFill();
        this.graphics.beginFill(0x27AE60);
        this.graphics.drawCircle(0, -6, 8); // 葉子
        this.graphics.endFill();
        break;
        
      case 'bookshelf':
        // 書架（木色）
        this.graphics.beginFill(0x8B4513);
        this.graphics.drawRect(-12, -20, 24, 30);
        this.graphics.endFill();
        this.graphics.lineStyle(2, 0xA0522D);
        this.graphics.moveTo(-12, -10);
        this.graphics.lineTo(12, -10);
        this.graphics.moveTo(-12, 0);
        this.graphics.lineTo(12, 0);
        break;
        
      case 'water-dispenser':
        // 飲水機（藍色）
        this.graphics.beginFill(0x3498DB);
        this.graphics.drawRect(-8, -15, 16, 20);
        this.graphics.endFill();
        this.graphics.beginFill(0x2980B9);
        this.graphics.drawRect(-8, -18, 16, 3);
        this.graphics.endFill();
        // 紅藍按鈕
        this.graphics.beginFill(0xE74C3C);
        this.graphics.drawCircle(-4, -5, 2);
        this.graphics.endFill();
        this.graphics.beginFill(0x3498DB);
        this.graphics.drawCircle(4, -5, 2);
        this.graphics.endFill();
        break;
    }
  }
  
  public destroy() {
    if (this.graphics) {
      this.graphics.destroy();
    }
  }
}
