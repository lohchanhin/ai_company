'use client';

import * as PIXI from 'pixi.js';
import { Server } from '@/types';
import { toIsometric } from '@/lib/isometric';
import { createPlaceholderSprite, createTextSprite, createProgressBar } from '@/lib/pixi';

export class ServerSprite {
  container: PIXI.Container;
  server: Server;
  
  // 視覺元素
  private characterSprite: PIXI.Graphics;
  private nameText: PIXI.Text;
  private statusText: PIXI.Text;
  private cpuBar: PIXI.Graphics | null = null;
  private ramBar: PIXI.Graphics | null = null;
  
  // 動畫
  private animationFrame = 0;
  private animationSpeed = 0.1;
  
  constructor(server: Server) {
    this.server = server;
    this.container = new PIXI.Container();
    
    // 設置位置（等距座標）
    const iso = toIsometric(server.visual.gridX, server.visual.gridY);
    this.container.position.set(iso.isoX, iso.isoY);
    
    // 創建角色精靈（臨時彩色方塊）
    this.characterSprite = this.createCharacterPlaceholder();
    this.container.addChild(this.characterSprite);
    
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
   * 創建角色佔位符（臨時）
   */
  private createCharacterPlaceholder(): PIXI.Graphics {
    const colors = {
      developer: 0x4A90E2,  // 藍色
      database: 0xF5A623,   // 橘色
      web: 0x7ED321,        // 綠色
      generic: 0x9E9E9E     // 灰色
    };
    
    const color = colors[this.server.visual.type] || colors.generic;
    const sprite = createPlaceholderSprite(color, 32, 32);
    sprite.pivot.set(16, 16);
    
    return sprite;
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
  }
  
  /**
   * 動畫更新（每幀調用）
   */
  update(delta: number) {
    this.animationFrame += this.animationSpeed * delta;
    
    // 工作中動畫：輕微晃動
    if (this.server.currentTask) {
      const offset = Math.sin(this.animationFrame) * 2;
      this.characterSprite.position.y = offset;
    } else {
      this.characterSprite.position.y = 0;
    }
  }
  
  /**
   * 銷毀
   */
  destroy() {
    this.container.destroy({ children: true });
  }
}
