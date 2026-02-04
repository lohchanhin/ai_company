'use client';

import * as PIXI from 'pixi.js';
import { toIsometric } from '@/lib/isometric';

export class FloorTileSprite {
  public container: PIXI.Container;
  public graphics: PIXI.Graphics;
  private gridX: number;
  private gridY: number;
  private color: number;
  
  constructor(gridX: number, gridY: number, type: 'wood' | 'blue' | 'gray' | 'green' | 'red') {
    this.gridX = gridX;
    this.gridY = gridY;
    
    // 地板顏色
    const colorMap = {
      'wood': 0xD2B48C,  // 木質地板（棕色）
      'blue': 0x3498DB,  // 開發區（藍色）
      'gray': 0x95A5A6,  // 會議區（灰色）
      'green': 0x27AE60, // 休息區（綠色）
      'red': 0xE74C3C    // 管理區（紅色）
    };
    
    this.color = colorMap[type];
    this.container = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.draw();
  }
  
  private draw() {
    const iso = toIsometric(this.gridX, this.gridY);
    
    this.graphics.clear();
    this.graphics.alpha = 0.6;
    
    // 繪製等距地磚（菱形）
    const tileWidth = 64;
    const tileHeight = 32;
    
    this.graphics.moveTo(iso.isoX, iso.isoY - tileHeight / 2); // 上
    this.graphics.lineTo(iso.isoX + tileWidth / 2, iso.isoY);  // 右
    this.graphics.lineTo(iso.isoX, iso.isoY + tileHeight / 2); // 下
    this.graphics.lineTo(iso.isoX - tileWidth / 2, iso.isoY);  // 左
    this.graphics.lineTo(iso.isoX, iso.isoY - tileHeight / 2); // 回到上
    this.graphics.fill(this.color);
    
    // 邊框
    this.graphics.moveTo(iso.isoX, iso.isoY - tileHeight / 2);
    this.graphics.lineTo(iso.isoX + tileWidth / 2, iso.isoY);
    this.graphics.lineTo(iso.isoX, iso.isoY + tileHeight / 2);
    this.graphics.lineTo(iso.isoX - tileWidth / 2, iso.isoY);
    this.graphics.lineTo(iso.isoX, iso.isoY - tileHeight / 2);
    this.graphics.stroke({ width: 1, color: 0x000000, alpha: 0.2 });
  }
  
  // Pixi.js 8.x: 移除 load() 方法，不需要非同步載入
  public async load() {
    // Graphics 不需要載入，立即可用
    return Promise.resolve();
  }
  
  public destroy() {
    if (this.graphics) {
      this.graphics.destroy();
    }
    if (this.container) {
      this.container.destroy();
    }
  }
}
