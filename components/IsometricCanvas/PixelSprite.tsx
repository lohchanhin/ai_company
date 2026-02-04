'use client';

import * as PIXI from 'pixi.js';
import { toIsometric } from '@/lib/isometric';

export class PixelSprite {
  public container: PIXI.Container;
  private sprite: PIXI.Sprite | null = null;
  private gridX: number;
  private gridY: number;
  private spritePath: string;
  private scale: number;
  private loaded: boolean = false;
  
  constructor(
    type: string,
    spriteName: string,
    gridX: number,
    gridY: number,
    scale: number = 1
  ) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.scale = scale;
    this.container = new PIXI.Container();
    
    // 將 sprite 名稱轉換為完整路徑
    this.spritePath = this.resolveSpritePath(type, spriteName);
    
    const iso = toIsometric(gridX, gridY);
    this.container.position.set(iso.isoX, iso.isoY);
  }
  
  /**
   * 將 sprite 名稱轉換為完整路徑
   */
  private resolveSpritePath(type: string, name: string): string {
    // 如果已經是完整路徑（以 / 或 http 開頭），直接返回
    if (name.startsWith('/') || name.startsWith('http')) {
      return name;
    }
    
    // 根據類型決定目錄
    const typeMap: Record<string, string> = {
      'furniture': 'furniture',
      'object': 'objects',
      'decoration': 'objects',
      'character': 'characters',
      'floor': 'floors'
    };
    
    const directory = typeMap[type] || 'objects';
    
    // 處理特殊命名（如 object-monitor → monitor）
    const cleanName = name.replace(/^(object|furniture|decoration)-/, '');
    
    return `/sprites/${directory}/${cleanName}.png`;
  }
  
  public async load(): Promise<void> {
    if (this.loaded) return;
    
    try {
      console.log(`Loading sprite: ${this.spritePath}`);
      const texture = await PIXI.Assets.load(this.spritePath);
      this.sprite = new PIXI.Sprite(texture);
      
      // 設置錨點（底部中心）
      this.sprite.anchor.set(0.5, 1);
      
      // 縮放
      this.sprite.scale.set(this.scale);
      
      // 像素風格
      texture.source.scaleMode = 'nearest';
      
      this.container.addChild(this.sprite);
      this.loaded = true;
      console.log(`✅ Loaded: ${this.spritePath}`);
    } catch (error) {
      console.warn(`❌ Failed to load sprite: ${this.spritePath}`, error);
      
      // 失敗時顯示佔位符
      const placeholder = new PIXI.Graphics();
      placeholder.rect(-8, -16, 16, 16);
      placeholder.fill(0xff00ff);
      this.container.addChild(placeholder);
      this.loaded = true;
    }
  }
  
  public destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
    if (this.container) {
      this.container.destroy({ children: true });
    }
  }
}
