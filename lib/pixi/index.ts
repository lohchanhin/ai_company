'use client';

import * as PIXI from 'pixi.js';

export class PixiApp {
  app: PIXI.Application;
  container: HTMLElement | null = null;
  
  constructor() {
    this.app = new PIXI.Application();
  }
  
  async init(container: HTMLElement, width: number, height: number) {
    this.container = container;
    
    await this.app.init({
      width,
      height,
      backgroundColor: 0xE8E8E8,
      antialias: false, // 像素風格不需要抗鋸齒
      resolution: window.devicePixelRatio || 1,
    });
    
    container.appendChild(this.app.canvas);
    
    // 設置像素風格
    PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest';
    
    return this.app;
  }
  
  destroy() {
    if (this.container && this.app.canvas) {
      this.container.removeChild(this.app.canvas);
    }
    // Pixi.js 8.x: destroy(options) 或 destroy(removeView)
    this.app.destroy(true);
  }
  
  resize(width: number, height: number) {
    this.app.renderer.resize(width, height);
  }
}

/**
 * 創建簡單的彩色方塊精靈（臨時替代像素圖片）
 */
export function createPlaceholderSprite(
  color: number,
  width: number,
  height: number
): PIXI.Graphics {
  const graphics = new PIXI.Graphics();
  
  // Pixi.js 8.x 新 API: rect() + fill()
  graphics.rect(0, 0, width, height);
  graphics.fill(color);
  
  // 繪製邊框
  graphics.rect(0, 0, width, height);
  graphics.stroke({ width: 2, color: 0x000000 });
  
  return graphics;
}

/**
 * 創建文字精靈
 */
export function createTextSprite(
  text: string,
  style?: Partial<PIXI.TextStyle>
): PIXI.Text {
  const defaultStyle: Partial<PIXI.TextStyle> = {
    fontFamily: 'monospace',
    fontSize: 12,
    fill: 0x333333,
    ...style
  };
  
  return new PIXI.Text({ text, style: defaultStyle });
}

/**
 * 創建進度條
 */
export function createProgressBar(
  width: number,
  height: number,
  progress: number, // 0-1
  color: number = 0x7ED321
): PIXI.Graphics {
  const graphics = new PIXI.Graphics();
  
  // 背景
  graphics.rect(0, 0, width, height);
  graphics.fill(0xCCCCCC);
  
  // 進度
  graphics.rect(2, 2, (width - 4) * progress, height - 4);
  graphics.fill(color);
  
  // 邊框
  graphics.rect(0, 0, width, height);
  graphics.stroke({ width: 1, color: 0x666666 });
  
  return graphics;
}
