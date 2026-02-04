'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { PixiApp } from '@/lib/pixi';
import { VPSEmployeeSprite } from './VPSEmployeeSprite';
import { FloorTileSprite } from './FloorTileSprite';
import { PixelSprite } from './PixelSprite';
import { useVPSMonitor } from '@/hooks/useVPSMonitor';
import { DEFAULT_VPS_CONFIG } from '@/lib/vps-monitor/types';
import { 
  FULL_OFFICE_SCENE, 
  FURNITURE_SPRITES, 
  OBJECT_SPRITES 
} from '@/lib/scene-config';

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
      console.log('✅ Pixi initialized:', { width, height, stage: app.stage });
      
      if (isCleanedUp) {
        pixiApp.destroy();
        return;
      }
      
      // 主容器
      const mainContainer = new PIXI.Container();
      app.stage.addChild(mainContainer);
      mainContainer.position.set(width / 2, 150);
      
      console.log('📦 Main container created at:', mainContainer.position);
      
      // ===== 建立辦公室地板 =====
      const floorContainer = new PIXI.Container();
      mainContainer.addChild(floorContainer);
      
      // 8x8 辦公室格子
      const officeSize = 8;
      let floorTileCount = 0;
      
      for (let y = 0; y < officeSize; y++) {
        for (let x = 0; x < officeSize; x++) {
          let floorType: 'wood' | 'blue' | 'gray' | 'green' | 'red' = 'wood';
          
          // 分區設計
          if (y < 3) {
            floorType = 'blue';  // 開發區（Y=0-2）
          } else if (y < 5) {
            floorType = 'gray';  // 會議區（Y=3-4）
          } else if (y < 7) {
            floorType = 'green'; // 休息區（Y=5-6）
          } else {
            floorType = 'red';   // 管理區（Y=7）
          }
          
          const tile = new FloorTileSprite(x, y, floorType);
          floorContainer.addChild(tile.graphics);
          floorTileCount++;
        }
      }
      
      console.log(`🎨 Floor tiles created: ${floorTileCount}`);
      
      // ===== 建立完整辦公室場景 =====
      const sceneContainer = new PIXI.Container();
      mainContainer.addChild(sceneContainer);
      
      console.log(`📦 Loading ${FULL_OFFICE_SCENE.length} scene objects...`);
      
      // 加載所有場景物件（僅環境，不含員工）
      FULL_OFFICE_SCENE.forEach((obj) => {
        let spritePath = '';
        
        if (obj.type === 'furniture') {
          spritePath = FURNITURE_SPRITES[obj.sprite];
        } else if (obj.type === 'object') {
          spritePath = OBJECT_SPRITES[obj.sprite];
        }
        
        if (spritePath) {
          const pixelSprite = new PixelSprite(
            spritePath,
            obj.gridX,
            obj.gridY,
            obj.scale || 1
          );
          sceneContainer.addChild(pixelSprite.container);
        }
      });
      
      console.log('✅ Environment objects loaded (no employees)');
      
      // ===== VPS 員工（最上層）=====
      const employeeContainer = new PIXI.Container();
      mainContainer.addChild(employeeContainer);
      
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
        
        employeeContainer.addChild(sprite.container);
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
    }).catch((err) => {
      console.error('❌ Pixi initialization failed:', err);
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
  
  // 錯誤提示（但仍然顯示 Canvas）
  if (error) {
    console.error('VPS Monitor Error:', error);
  }
  
  return (
    <div 
      ref={canvasRef} 
      className="w-full h-full bg-gray-100"
      style={{ minHeight: '600px' }}
    >
      {/* Pixi canvas 會被注入這裡 */}
      {loading && statuses.length === 0 && (
        <div className="absolute top-4 right-4 text-sm text-gray-500">
          正在載入 VPS 數據...
        </div>
      )}
    </div>
  );
}
