'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { PixiApp } from '@/lib/pixi';
import { VPSEmployeeSprite } from './VPSEmployeeSprite';
import { useVPSMonitor } from '@/hooks/useVPSMonitor';
import { DEFAULT_VPS_CONFIG } from '@/lib/vps-monitor/types';

export function VPSOfficeCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const pixiAppRef = useRef<PixiApp | null>(null);
  const spritesRef = useRef<Map<string, VPSEmployeeSprite>>(new Map());
  
  // 實時監控數據（每 5 秒更新）
  const { statuses, loading, error } = useVPSMonitor({ pollInterval: 5000 });
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    let isCleanedUp = false;
    
    // 初始化 Pixi
    const pixiApp = new PixiApp();
    pixiAppRef.current = pixiApp;
    
    const width = canvasRef.current.clientWidth || 800;
    const height = canvasRef.current.clientHeight || 600;
    
    pixiApp.init(canvasRef.current, width, height).then((app) => {
      if (isCleanedUp) {
        pixiApp.destroy();
        return;
      }
      
      // 主容器
      const mainContainer = new PIXI.Container();
      app.stage.addChild(mainContainer);
      mainContainer.position.set(width / 2, 150);
      
      // 創建初始 VPS 員工
      DEFAULT_VPS_CONFIG.forEach((vpsConfig) => {
        const initialStatus = {
          id: vpsConfig.id,
          status: 'offline' as const,
          lastUpdate: Date.now()
        };
        
        const sprite = new VPSEmployeeSprite(
          initialStatus,
          vpsConfig.displayRole,
          vpsConfig.name,
          vpsConfig.gridX,
          vpsConfig.gridY
        );
        
        mainContainer.addChild(sprite.container);
        spritesRef.current.set(vpsConfig.id, sprite);
        
        // 點擊事件
        sprite.container.on('pointerdown', () => {
          console.log('Clicked VPS:', vpsConfig.name);
          // TODO: 顯示詳情面板
        });
      });
      
      // 動畫循環
      app.ticker.add((ticker) => {
        // 根據最新狀態更新所有 sprite
        statuses.forEach((status) => {
          const sprite = spritesRef.current.get(status.id);
          if (sprite) {
            sprite.update(ticker.deltaTime, status);
          }
        });
      });
    });
    
    return () => {
      isCleanedUp = true;
      
      spritesRef.current.forEach((sprite) => {
        try {
          sprite.destroy();
        } catch (e) {
          console.warn('Failed to destroy sprite:', e);
        }
      });
      spritesRef.current.clear();
      
      if (pixiAppRef.current) {
        try {
          pixiAppRef.current.destroy();
        } catch (e) {
          console.warn('Failed to destroy Pixi app:', e);
        }
        pixiAppRef.current = null;
      }
    };
  }, []);
  
  // 監聽狀態變化（不需要重新初始化 Pixi，ticker 會自動讀取最新狀態）
  useEffect(() => {
    // statuses 改變時，ticker 會自動使用最新數據
    console.log('VPS statuses updated:', statuses.length);
  }, [statuses]);
  
  if (loading && statuses.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在連線到 VPS...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-2">⚠️ 連線失敗</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={canvasRef} 
      className="w-full h-full bg-gray-100"
      style={{ minHeight: '600px' }}
    >
      {/* Pixi canvas 會被注入這裡 */}
    </div>
  );
}
