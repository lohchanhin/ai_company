'use client';

import * as PIXI from 'pixi.js';
import { toIsometric } from '@/lib/isometric';
import { VPSStatus } from '@/lib/vps-monitor/types';

export class VPSEmployeeSprite {
  public container: PIXI.Container;
  private graphics: PIXI.Graphics;
  private statusText: PIXI.Text;
  private nameText: PIXI.Text;
  private vpsId: string;
  private animationTime: number = 0;
  
  constructor(vpsStatus: VPSStatus, displayRole: string, name: string, gridX: number, gridY: number) {
    this.vpsId = vpsStatus.id;
    this.container = new PIXI.Container();
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    
    // 等距座標
    const isoPos = toIsometric(gridX, gridY);
    this.container.position.set(isoPos.isoX, isoPos.isoY);
    
    // 創建員工方塊（代表 VPS）
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    
    // 名稱標籤
    this.nameText = new PIXI.Text({
      text: name,
      style: {
        fontSize: 10,
        fill: 0xffffff,
        fontWeight: 'bold',
        stroke: { color: 0x000000, width: 2 }
      }
    });
    this.nameText.anchor.set(0.5);
    this.nameText.position.set(0, -30);
    this.container.addChild(this.nameText);
    
    // 狀態標籤
    this.statusText = new PIXI.Text({
      text: '',
      style: {
        fontSize: 8,
        fill: 0xffffff
      }
    });
    this.statusText.anchor.set(0.5);
    this.statusText.position.set(0, 25);
    this.container.addChild(this.statusText);
    
    // 初始繪製
    this.draw(vpsStatus);
  }
  
  private getColorFromStatus(status: VPSStatus): number {
    if (status.status === 'offline') return 0x95A5A6; // 灰色
    if (status.status === 'critical') return 0xE74C3C; // 紅色
    if (status.status === 'warning') return 0xF39C12; // 黃色
    return 0x3498DB; // 藍色（正常）
  }
  
  private draw(vpsStatus: VPSStatus) {
    this.graphics.clear();
    
    const color = this.getColorFromStatus(vpsStatus);
    
    // 繪製員工身體（等距矩形）
    this.graphics.beginFill(color);
    
    // 頭部
    this.graphics.drawCircle(0, -10, 6);
    
    // 身體
    this.graphics.drawRect(-8, -5, 16, 15);
    
    // 手臂
    this.graphics.drawRect(-12, -2, 4, 8);
    this.graphics.drawRect(8, -2, 4, 8);
    
    // 腿
    this.graphics.drawRect(-6, 10, 5, 10);
    this.graphics.drawRect(1, 10, 5, 10);
    
    this.graphics.endFill();
    
    // 更新狀態文字
    if (vpsStatus.metrics) {
      this.statusText.text = `CPU ${Math.round(vpsStatus.metrics.cpu)}%`;
    } else {
      this.statusText.text = 'OFFLINE';
    }
  }
  
  public update(deltaTime: number, vpsStatus?: VPSStatus) {
    if (vpsStatus) {
      this.draw(vpsStatus);
      
      // 根據 CPU 負載調整動畫速度
      if (vpsStatus.metrics && vpsStatus.status !== 'offline') {
        const cpuFactor = vpsStatus.metrics.cpu / 100;
        this.animationTime += deltaTime * cpuFactor * 0.1;
        
        // 上下跳動動畫（CPU 越高跳越快）
        const bounce = Math.sin(this.animationTime) * 2;
        this.graphics.position.y = bounce;
      } else {
        // 離線時停止動畫
        this.graphics.position.y = 0;
      }
    }
  }
  
  public destroy() {
    if (this.graphics) {
      this.graphics.destroy();
    }
    if (this.statusText) {
      this.statusText.destroy();
    }
    if (this.nameText) {
      this.nameText.destroy();
    }
    if (this.container) {
      this.container.destroy({ children: true });
    }
  }
  
  public getId(): string {
    return this.vpsId;
  }
}
