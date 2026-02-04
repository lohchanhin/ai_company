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
    spritePath: string,
    gridX: number,
    gridY: number,
    scale: number = 1
  ) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.spritePath = spritePath;
    this.scale = scale;
    this.container = new PIXI.Container();
    
    const iso = toIsometric(gridX, gridY);
    this.container.position.set(iso.isoX, iso.isoY);
  }
  
  public async load(): Promise<void> {
    if (this.loaded) return;
    
    try {
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
    } catch (error) {
      console.warn(`Failed to load sprite: ${this.spritePath}`, error);
      
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
