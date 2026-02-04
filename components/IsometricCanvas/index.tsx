'use client';

import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Server } from '@/types';
import { PixiApp } from '@/lib/pixi';
import { ServerSprite } from './ServerSprite';

interface IsometricCanvasProps {
  servers: Server[];
  onServerClick?: (server: Server) => void;
}

export function IsometricCanvas({ servers, onServerClick }: IsometricCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const pixiAppRef = useRef<PixiApp | null>(null);
  const serverSpritesRef = useRef<Map<string, ServerSprite>>(new Map());
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    let isCleanedUp = false;
    
    // 初始化 Pixi
    const pixiApp = new PixiApp();
    pixiAppRef.current = pixiApp;
    
    pixiApp.init(canvasRef.current, dimensions.width, dimensions.height).then((app) => {
      // 如果已經清理了，不要繼續
      if (isCleanedUp) {
        pixiApp.destroy();
        return;
      }
      
      // 創建主容器（用於平移和縮放）
      const mainContainer = new PIXI.Container();
      app.stage.addChild(mainContainer);
      
      // 居中偏移
      mainContainer.position.set(dimensions.width / 2, 100);
      
      // 創建伺服器精靈
      servers.forEach((server) => {
        const sprite = new ServerSprite(server);
        if (sprite.container) {
          mainContainer.addChild(sprite.container);
          serverSpritesRef.current.set(server.id, sprite);
          
          // 點擊事件
          sprite.container.on('pointerdown', () => {
            onServerClick?.(server);
          });
        }
      });
      
      // 動畫循環
      app.ticker.add((ticker) => {
        serverSpritesRef.current.forEach((sprite) => {
          sprite.update(ticker.deltaTime);
        });
      });
    });
    
    // 清理
    return () => {
      isCleanedUp = true;
      
      serverSpritesRef.current.forEach((sprite) => {
        try {
          sprite.destroy();
        } catch (e) {
          console.warn('Failed to destroy sprite:', e);
        }
      });
      serverSpritesRef.current.clear();
      
      // 安全清理 Pixi App
      if (pixiAppRef.current) {
        try {
          pixiAppRef.current.destroy();
        } catch (e) {
          console.warn('Failed to destroy Pixi app:', e);
        }
        pixiAppRef.current = null;
      }
    };
  }, []); // 移除 dimensions 依賴，改用 resize 處理
  
  // 更新伺服器狀態
  useEffect(() => {
    servers.forEach((server) => {
      const sprite = serverSpritesRef.current.get(server.id);
      if (sprite) {
        sprite.updateStatus(server);
      }
    });
  }, [servers]);
  
  // 響應式調整
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const newWidth = rect.width;
        const newHeight = Math.max(600, window.innerHeight - 200);
        
        setDimensions({
          width: newWidth,
          height: newHeight
        });
        
        // 調整 Pixi App 大小
        if (pixiAppRef.current) {
          pixiAppRef.current.resize(newWidth, newHeight);
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div 
      ref={canvasRef} 
      className="w-full h-full border-2 border-gray-300 rounded-lg bg-gray-100"
      style={{ minHeight: 600 }}
    />
  );
}
