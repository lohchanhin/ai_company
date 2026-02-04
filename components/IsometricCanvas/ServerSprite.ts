'use client';

import * as PIXI from 'pixi.js';
import { Server } from '@/types';
import { toIsometric } from '@/lib/isometric';
import { createTextSprite, createProgressBar } from '@/lib/pixi';

export class ServerSprite {
  container: PIXI.Container;
  server: Server;
  
  // 視覺元素
  private sprite: PIXI.Sprite | null = null;
  private nameText: PIXI.Text;
  private statusText: PIXI.Text;
  private cpuBar: PIXI.Graphics | null = null;
  private ramBar: PIXI.Graphics | null = null;
  
  // 動畫
  private animationFrame = 0;
  private animationSpeed = 0.1;
  private animationTextures: PIXI.Texture[] = [];
  private currentFrame = 0;
  
  constructor(server: Server) {
    this.server = server;
    this.container = new PIXI.Container();
    
    // 設置位置（等距座標）
    const iso = toIsometric(server.visual.gridX, server.visual.gridY);
    this.container.position.set(iso.isoX, iso.isoY);
    
    // 創建精靈（異步載入）
    this.loadSprite();
    
    // 創建名稱文字
    this.nameText = createTextSprite(server.name, { fontSize: 10, fill: 0x333333 });
    this.nameText.anchor.set(0.5, 0);
    this.nameText.position.set(0, 40);
    this.container.addChild(this.nameText);
    
    // 創建狀態文字
    this.statusText = createTextSprite('🟢', { fontSize: 14 });
    this.statusText.anchor.set(0.5, 0);
    this.statusText.position.set(0, -45);
    this.container.addChild(this.statusText);
    
    // 創建資源條
    this.updateResourceBars();
    
    // 啟用互動
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
  }
  
  /**
   * 載入精靈圖片
   */
  private async loadSprite() {
    try {
      const spritePath = this.getSpritePath();
      const texture = await PIXI.Assets.load(spritePath);
      
      this.sprite = new PIXI.Sprite(texture);
      this.sprite.anchor.set(0.5, 0.5);
      this.sprite.position.set(0, 0);
      
      // 如果需要動畫，載入所有幀
      if (this.server.visual.type === 'developer') {
        await this.loadAnimationFrames();
      }
      
      this.container.addChildAt(this.sprite, 0);
    } catch (error) {
      console.error('Failed to load sprite:', error);
      // 降級：使用彩色方塊
      this.createFallbackSprite();
    }
  }
  
  /**
   * 載入動畫幀
   */
  private async loadAnimationFrames() {
    try {
      const state = this.server.currentTask ? 'working' : 'idle';
      const frameCount = state === 'idle' ? 2 : 2; // 先用2幀測試
      
      for (let i = 1; i <= frameCount; i++) {
        const path = `/sprites/characters/developer-${state}-${i}.png`;
        const texture = await PIXI.Assets.load(path);
        this.animationTextures.push(texture);
      }
    } catch (error) {
      console.warn('Failed to load animation frames:', error);
    }
  }
  
  /**
   * 獲取精靈路徑
   */
  private getSpritePath(): string {
    const { type } = this.server.visual;
    
    switch (type) {
      case 'developer':
        return '/sprites/characters/developer-idle-1.png';
      case 'database':
        return '/sprites/servers/server-database.png';
      case 'web':
        return '/sprites/servers/server-web.png';
      default:
        return '/sprites/servers/server-generic.png';
    }
  }
  
  /**
   * 創建降級方案（彩色方塊）
   */
  private createFallbackSprite() {
    const colors = {
      developer: 0x4A90E2,
      database: 0xF5A623,
      web: 0x7ED321,
      generic: 0x9E9E9E
    };
    
    const color = colors[this.server.visual.type] || colors.generic;
    const graphics = new PIXI.Graphics();
    graphics.rect(-16, -16, 32, 32);
    graphics.fill(color);
    graphics.pivot.set(0, 0);
    
    this.container.addChildAt(graphics, 0);
  }
  
  /**
   * 更新資源顯示條
   */
  private updateResourceBars() {
    // 移除舊的
    if (this.cpuBar) this.container.removeChild(this.cpuBar);
    if (this.ramBar) this.container.removeChild(this.ramBar);
    
    // CPU 條
    this.cpuBar = createProgressBar(
      60,
      6,
      this.server.status.cpu / 100,
      this.getResourceColor(this.server.status.cpu)
    );
    this.cpuBar.position.set(-30, 52);
    this.container.addChild(this.cpuBar);
    
    // RAM 條
    this.ramBar = createProgressBar(
      60,
      6,
      this.server.status.memory / 100,
      this.getResourceColor(this.server.status.memory)
    );
    this.ramBar.position.set(-30, 60);
    this.container.addChild(this.ramBar);
  }
  
  /**
   * 根據使用率獲取顏色
   */
  private getResourceColor(usage: number): number {
    if (usage < 60) return 0x7ED321;   // 綠色
    if (usage < 80) return 0xF5A623;   // 橘色
    if (usage < 90) return 0xFF9800;   // 深橘
    return 0xD0021B;                   // 紅色
  }
  
  /**
   * 更新狀態
   */
  updateStatus(server: Server) {
    this.server = server;
    
    // 更新狀態圖示
    if (!server.status.online) {
      this.statusText.text = '⚫';
    } else if (server.currentTask) {
      this.statusText.text = '🟢';
    } else if (server.status.cpu > 90 || server.status.memory > 90) {
      this.statusText.text = '🔴';
    } else {
      this.statusText.text = '🟡';
    }
    
    // 更新資源條
    this.updateResourceBars();
    
    // 切換動畫
    if (this.animationTextures.length > 0) {
      this.loadAnimationFrames();
    }
  }
  
  /**
   * 動畫更新（每幀調用）
   */
  update(delta: number) {
    this.animationFrame += this.animationSpeed * delta;
    
    // 播放動畫
    if (this.sprite && this.animationTextures.length > 0) {
      const frameIndex = Math.floor(this.animationFrame / 10) % this.animationTextures.length;
      if (frameIndex !== this.currentFrame) {
        this.currentFrame = frameIndex;
        this.sprite.texture = this.animationTextures[frameIndex];
      }
    }
    
    // 工作中動畫：輕微晃動
    if (this.server.currentTask && this.sprite) {
      const offset = Math.sin(this.animationFrame) * 2;
      this.sprite.position.y = offset;
    } else if (this.sprite) {
      this.sprite.position.y = 0;
    }
  }
  
  /**
   * 銷毀
   */
  destroy() {
    this.container.destroy({ children: true });
  }
}
