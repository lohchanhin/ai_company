'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { PixiApp } from '@/lib/pixi';
import { FloorTileSprite } from './FloorTileSprite';
import { PixelSprite } from './PixelSprite';
import { OfficeEditor, EditorMode } from '@/lib/editor/OfficeEditor';
import { DraggableObject } from '@/lib/editor/DraggableObject';
import { KeyboardManager } from '@/lib/editor/KeyboardManager';
import { AutoLayoutEngine } from '@/lib/editor/AutoLayoutEngine';
import { SceneObject, getFloorTypeForZone } from '@/lib/scene-config';
import { toIsometric } from '@/lib/pixi/isometric';

interface EditableOfficeCanvasProps {
  mode: EditorMode;
  onModeChange?: (mode: EditorMode) => void;
  placingObjectType: string | null;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  vpsCount?: number;
  onEditorReady?: (editor: OfficeEditor) => void;
}

export function EditableOfficeCanvas({
  mode,
  onModeChange,
  placingObjectType,
  onUndo,
  onRedo,
  onSave,
  vpsCount = 8,
  onEditorReady
}: EditableOfficeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const pixiAppRef = useRef<PixiApp | null>(null);
  const editorRef = useRef<OfficeEditor | null>(null);
  const keyboardRef = useRef<KeyboardManager | null>(null);
  const draggablesRef = useRef<Map<string, DraggableObject>>(new Map());
  
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [previewSprite, setPreviewSprite] = useState<PIXI.Container | null>(null);
  const [highlightGraphics, setHighlightGraphics] = useState<PIXI.Graphics | null>(null);
  const [currentGridPos, setCurrentGridPos] = useState<{ x: number; y: number } | null>(null);

  // 初始化編輯器
  useEffect(() => {
    if (!editorRef.current) {
      // 使用自動佈局生成初始場景
      const initialObjects = AutoLayoutEngine.generateLayout({
        gridWidth: 8,
        gridHeight: 8,
        vpsCount,
        includeCommonAreas: true,
        workstationSpacing: 2
      });
      
      editorRef.current = new OfficeEditor(initialObjects);
      editorRef.current.setMode(mode);
      
      // 通知父組件編輯器已就緒
      if (onEditorReady) {
        onEditorReady(editorRef.current);
      }
    }
  }, [vpsCount, mode, onEditorReady]);

  // 初始化快捷鍵
  useEffect(() => {
    if (!keyboardRef.current) {
      keyboardRef.current = new KeyboardManager();
      
      keyboardRef.current.on('undo', () => {
        if (editorRef.current) {
          editorRef.current.undo();
          refreshScene();
          onUndo?.();
        }
      });
      
      keyboardRef.current.on('redo', () => {
        if (editorRef.current) {
          editorRef.current.redo();
          refreshScene();
          onRedo?.();
        }
      });
      
      keyboardRef.current.on('save', () => {
        onSave?.();
      });
      
      keyboardRef.current.on('delete', () => {
        if (editorRef.current && selectedObjectId) {
          editorRef.current.removeObject(selectedObjectId);
          setSelectedObjectId(null);
          refreshScene();
        }
      });
      
      keyboardRef.current.on('escape', () => {
        setSelectedObjectId(null);
        if (onModeChange) {
          onModeChange('view');
        }
      });
    }
    
    return () => {
      keyboardRef.current?.destroy();
    };
  }, [selectedObjectId, onUndo, onRedo, onSave, onModeChange]);

  // 初始化 Pixi.js
  useEffect(() => {
    if (!canvasRef.current || pixiAppRef.current) return;

    const initPixi = async () => {
      try {
        const container = canvasRef.current;
        if (!container) {
          console.error('Canvas container not found');
          return;
        }

        const width = container.clientWidth || 800;
        const height = container.clientHeight || 600;

        console.log('Initializing Pixi.js', { width, height });

        const pixiApp = new PixiApp({
          width,
          height,
          backgroundColor: 0xf5f5f5
        });

        await pixiApp.init();
        const app = pixiApp.getApp();
        
        if (!app) {
          console.error('Failed to get Pixi app');
          return;
        }

        if (!app.canvas) {
          console.error('Canvas not created');
          return;
        }

        console.log('Appending canvas to container');
        container.appendChild(app.canvas as HTMLCanvasElement);
        pixiAppRef.current = pixiApp;

        // 建立場景
        await buildScene(pixiApp);
        setIsReady(true);

      } catch (error) {
        console.error('Pixi.js 初始化失敗:', error);
      }
    };

    initPixi();

    return () => {
      if (pixiAppRef.current) {
        pixiAppRef.current.destroy();
        pixiAppRef.current = null;
      }
    };
  }, []);

  // 更新編輯模式 + 預覽精靈
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setMode(mode);
    }
    
    // 更新所有物件的可拖放狀態
    const isDraggable = mode === 'edit';
    draggablesRef.current.forEach(draggable => {
      draggable.setDraggable(isDraggable);
    });

    // 處理放置模式預覽
    const app = pixiAppRef.current?.getApp();
    if (app && mode === 'place' && placingObjectType) {
      // 創建預覽精靈
      const createPreview = async () => {
        const preview = new PIXI.Container();
        const sprite = new PixelSprite('object', placingObjectType, 0, 0);
        await sprite.load();
        
        // 半透明
        sprite.container.alpha = 0.6;
        preview.addChild(sprite.container);
        
        app.stage.addChild(preview);
        setPreviewSprite(preview);
      };

      // 創建高亮網格
      const highlight = new PIXI.Graphics();
      app.stage.addChild(highlight);
      setHighlightGraphics(highlight);

      createPreview();

      return () => {
        // 清理預覽
        if (previewSprite) {
          previewSprite.destroy({ children: true });
          setPreviewSprite(null);
        }
        if (highlightGraphics) {
          highlightGraphics.destroy();
          setHighlightGraphics(null);
        }
      };
    } else {
      // 非放置模式，清理預覽
      if (previewSprite) {
        previewSprite.destroy({ children: true });
        setPreviewSprite(null);
      }
      if (highlightGraphics) {
        highlightGraphics.destroy();
        setHighlightGraphics(null);
      }
    }
  }, [mode, placingObjectType]);

  // 建立場景
  const buildScene = useCallback(async (pixiApp: PixiApp) => {
    const app = pixiApp.getApp();
    if (!app || !editorRef.current) {
      console.log('buildScene: app or editor not ready', { app: !!app, editor: !!editorRef.current });
      return;
    }

    console.log('buildScene: Starting to build scene');

    const stage = app.stage;
    stage.removeChildren();

    // 主場景容器（可拖曳）
    const sceneContainer = new PIXI.Container();
    stage.addChild(sceneContainer);
    
    // 啟用場景拖曳
    sceneContainer.eventMode = 'static';
    sceneContainer.cursor = 'grab';
    
    let isDraggingScene = false;
    let dragStart = { x: 0, y: 0 };
    
    sceneContainer.on('pointerdown', (event: any) => {
      if (mode === 'view') {
        isDraggingScene = true;
        sceneContainer.cursor = 'grabbing';
        dragStart = {
          x: event.global.x - sceneContainer.x,
          y: event.global.y - sceneContainer.y
        };
      }
    });
    
    sceneContainer.on('pointermove', (event: any) => {
      if (isDraggingScene) {
        sceneContainer.x = event.global.x - dragStart.x;
        sceneContainer.y = event.global.y - dragStart.y;
      }
    });
    
    sceneContainer.on('pointerup', () => {
      isDraggingScene = false;
      sceneContainer.cursor = 'grab';
    });
    
    sceneContainer.on('pointerupoutside', () => {
      isDraggingScene = false;
      sceneContainer.cursor = 'grab';
    });

    // 圖層
    const floorLayer = new PIXI.Container();
    const objectLayer = new PIXI.Container();

    sceneContainer.addChild(floorLayer);
    sceneContainer.addChild(objectLayer);

    // 置中視圖
    const offsetX = app.screen.width / 2 - 200;
    const offsetY = 150;
    floorLayer.position.set(offsetX, offsetY);
    objectLayer.position.set(offsetX, offsetY);

    console.log('buildScene: Layers created, drawing floor');

    // 繪製地板（8×8）
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const floorType = getFloorTypeForZone(x, y);
        const floorSprite = new FloorTileSprite(x, y, floorType);
        await floorSprite.load();
        floorLayer.addChild(floorSprite.container);
      }
    }

    console.log('buildScene: Floor complete, drawing objects');

    // 繪製所有物件
    const allObjects = editorRef.current.getAllObjects();
    console.log('buildScene: Object count:', allObjects.length);
    
    for (const { id, object } of allObjects) {
      await addObjectToScene(id, object, objectLayer);
    }

    console.log('buildScene: Scene build complete');
  }, []); // 空依賴，確保穩定引用

  // 新增物件到場景
  const addObjectToScene = async (
    id: string,
    obj: SceneObject,
    container: PIXI.Container
  ) => {
    const sprite = new PixelSprite(obj.type, obj.sprite, obj.gridX, obj.gridY);
    await sprite.load();
    container.addChild(sprite.container);

    // 建立拖放物件
    const draggable = new DraggableObject({
      sprite: sprite.container,
      gridX: obj.gridX,
      gridY: obj.gridY,
      snapToGrid: true,
      onDragStart: () => {
        setSelectedObjectId(id);
      },
      onDragEnd: (gridX, gridY) => {
        if (editorRef.current) {
          const success = editorRef.current.moveObject(id, gridX, gridY);
          if (!success) {
            // 移動失敗，恢復原位
            const originalObj = editorRef.current.getObject(id);
            if (originalObj) {
              draggable.setGridPosition(originalObj.gridX, originalObj.gridY);
            }
          }
        }
      }
    });

    draggable.setDraggable(mode === 'edit');
    draggablesRef.current.set(id, draggable);
  };

  // 重新整理場景
  const refreshScene = useCallback(() => {
    console.log('refreshScene called');
    if (pixiAppRef.current) {
      buildScene(pixiAppRef.current);
    }
  }, [buildScene]);

  // 處理滑鼠移動（放置模式預覽）
  const handleCanvasMouseMove = useCallback((event: React.MouseEvent) => {
    if (mode !== 'place' || !placingObjectType || !pixiAppRef.current) return;

    const app = pixiAppRef.current.getApp();
    if (!app) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // 簡化的網格計算（相對於場景偏移）
    const offsetX = app.screen.width / 2 - 200;
    const offsetY = 150;
    
    const relX = mouseX - offsetX;
    const relY = mouseY - offsetY;
    
    // 等距反轉計算
    const gridX = Math.round((relX / 64 + relY / 32) / 2);
    const gridY = Math.round((relY / 32 - relX / 64) / 2);

    // 限制在網格範圍內
    const clampedX = Math.max(0, Math.min(7, gridX));
    const clampedY = Math.max(0, Math.min(7, gridY));

    setCurrentGridPos({ x: clampedX, y: clampedY });

    // 更新預覽位置
    if (previewSprite) {
      const iso = toIsometric(clampedX, clampedY);
      previewSprite.position.set(offsetX + iso.isoX, offsetY + iso.isoY);
    }

    // 更新高亮網格
    if (highlightGraphics && editorRef.current) {
      const canPlace = !editorRef.current.hasCollision(clampedX, clampedY);
      const iso = toIsometric(clampedX, clampedY);
      
      highlightGraphics.clear();
      highlightGraphics.position.set(offsetX + iso.isoX, offsetY + iso.isoY);
      
      // 繪製高亮菱形
      const tileWidth = 64;
      const tileHeight = 32;
      const color = canPlace ? 0x00ff00 : 0xff0000; // 綠色可放置，紅色碰撞
      
      highlightGraphics.moveTo(0, -tileHeight / 2);
      highlightGraphics.lineTo(tileWidth / 2, 0);
      highlightGraphics.lineTo(0, tileHeight / 2);
      highlightGraphics.lineTo(-tileWidth / 2, 0);
      highlightGraphics.lineTo(0, -tileHeight / 2);
      highlightGraphics.fill({ color, alpha: 0.3 });
      
      highlightGraphics.moveTo(0, -tileHeight / 2);
      highlightGraphics.lineTo(tileWidth / 2, 0);
      highlightGraphics.lineTo(0, tileHeight / 2);
      highlightGraphics.lineTo(-tileWidth / 2, 0);
      highlightGraphics.lineTo(0, -tileHeight / 2);
      highlightGraphics.stroke({ width: 2, color, alpha: 0.8 });
    }
  }, [mode, placingObjectType, previewSprite, highlightGraphics, editorRef]);

  // 處理放置模式點擊
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (mode !== 'place' || !placingObjectType || !editorRef.current || !currentGridPos) return;

    // 檢查是否可放置
    if (editorRef.current.hasCollision(currentGridPos.x, currentGridPos.y)) {
      console.log('Cannot place: collision detected');
      return;
    }

    // 嘗試新增物件
    const newObj: SceneObject = {
      type: 'object',
      sprite: placingObjectType,
      gridX: currentGridPos.x,
      gridY: currentGridPos.y
    };

    const id = editorRef.current.addObject(newObj);
    if (id) {
      refreshScene();
    }
  }, [mode, placingObjectType, currentGridPos, refreshScene]);

  return (
    <div 
      ref={canvasRef} 
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      style={{ 
        width: '100%', 
        height: '100%',
        cursor: mode === 'place' ? 'crosshair' : mode === 'edit' ? 'move' : 'grab'
      }} 
    />
  );
}
