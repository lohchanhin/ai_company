'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [pixiError, setPixiError] = useState<string | null>(null);
  const [assetErrors, setAssetErrors] = useState<string[]>([]);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  
  // 實時監控數據（每 5 秒更新）
  const { statuses, loading, error } = useVPSMonitor({ pollInterval: 5000 });

  const smokeTestSpritePath = useMemo(() => OBJECT_SPRITES['plant-small'], []);
  
  useEffect(() => {
    if (!canvasRef.current) {
      console.warn('Canvas 尚未掛載，無法初始化 Pixi');
      setPixiError('Canvas 尚未掛載，請稍後再試');
      return;
    }

    let isCleanedUp = false;
    setSceneLoaded(false);
    setPixiError(null);
    setAssetErrors([]);
    
    // 初始化 Pixi
    const width = canvasRef.current.clientWidth || 800;
    const height = canvasRef.current.clientHeight || 600;
    const pixiApp = new PixiApp({ width, height, backgroundColor: 0xE8E8E8 });
    pixiAppRef.current = pixiApp;
    
    pixiApp.init().then((app) => {
      const pixiAppInstance = pixiApp.getApp();
      if (!pixiAppInstance || !pixiAppInstance.canvas) {
        setPixiError('Pixi Canvas 建立失敗');
        return;
      }

      if (canvasRef.current && !canvasRef.current.contains(pixiAppInstance.canvas)) {
        canvasRef.current.appendChild(pixiAppInstance.canvas as HTMLCanvasElement);
      }

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
      
      // 簡易 smoke test：確保 Pixi 可繪製
      const smokeTest = new PIXI.Graphics();
      smokeTest.rect(-6, -6, 12, 12);
      smokeTest.fill(0xffcc00);
      smokeTest.position.set(-width / 2 + 20, -120);
      mainContainer.addChild(smokeTest);

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

      const loadSceneObjects = async () => {
        const nextErrors: string[] = [];
        let loadedCount = 0;

        console.log(`📦 Loading ${FULL_OFFICE_SCENE.length} scene objects...`);

        for (const obj of FULL_OFFICE_SCENE) {
          let spritePath = '';

          if (obj.type === 'furniture') {
            spritePath = FURNITURE_SPRITES[obj.sprite] || '';
          } else if (obj.type === 'object') {
            spritePath = OBJECT_SPRITES[obj.sprite] || '';
          }

          if (!spritePath) {
            nextErrors.push(`缺少精靈路徑：${obj.type}/${obj.sprite}`);
            continue;
          }

          const pixelSprite = new PixelSprite(
            obj.type,
            spritePath,
            obj.gridX,
            obj.gridY,
            obj.scale || 1
          );
          const result = await pixelSprite.load();
          sceneContainer.addChild(pixelSprite.container);

          if (!result.success) {
            nextErrors.push(`載入失敗：${spritePath}`);
          } else {
            loadedCount += 1;
          }
        }

        // Smoke test sprite（單一 sprite）
        if (smokeTestSpritePath) {
          const smokeSprite = new PixelSprite('object', smokeTestSpritePath, 0, 0, 0.6);
          const smokeResult = await smokeSprite.load();
          sceneContainer.addChild(smokeSprite.container);
          if (!smokeResult.success) {
            nextErrors.push(`Smoke test 載入失敗：${smokeTestSpritePath}`);
          }
        } else {
          nextErrors.push('Smoke test 路徑不存在：plant-small');
        }

        if (isCleanedUp) {
          return;
        }

        if (nextErrors.length > 0) {
          console.warn('⚠️ Scene load errors:', nextErrors);
          setAssetErrors(nextErrors);
        }

        console.log(`✅ Environment objects loaded: ${loadedCount}`);
        setSceneLoaded(true);
      };

      loadSceneObjects();
      
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
      setPixiError(`Pixi 初始化失敗：${String(err)}`);
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
      className="relative w-full h-full bg-gray-100"
      style={{ minHeight: '600px' }}
    >
      {/* Pixi canvas 會被注入這裡 */}
      {loading && statuses.length === 0 && (
        <div className="absolute top-4 right-4 text-sm text-gray-500">
          正在載入 VPS 數據...
        </div>
      )}
      {(pixiError || assetErrors.length > 0) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 text-sm text-red-600">
          <div className="max-w-md space-y-2 rounded border border-red-200 bg-white p-4 shadow">
            <div className="font-semibold">載入失敗</div>
            {pixiError && <div>Pixi：{pixiError}</div>}
            {assetErrors.length > 0 && (
              <ul className="list-disc space-y-1 pl-4">
                {assetErrors.map((errMsg) => (
                  <li key={errMsg}>{errMsg}</li>
                ))}
              </ul>
            )}
            {!sceneLoaded && (
              <div className="text-gray-500">正在重試或等待資源載入...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
