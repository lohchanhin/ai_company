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

  // 更新編輯模式
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setMode(mode);
    }
    
    // 更新所有物件的可拖放狀態
    const isDraggable = mode === 'edit';
    draggablesRef.current.forEach(draggable => {
      draggable.setDraggable(isDraggable);
    });
  }, [mode]);

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

    // 圖層
    const floorLayer = new PIXI.Container();
    const objectLayer = new PIXI.Container();

    stage.addChild(floorLayer);
    stage.addChild(objectLayer);

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

  // 處理放置模式點擊
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (mode !== 'place' || !placingObjectType || !editorRef.current) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // 計算點擊位置（簡化版，需要精確的等距反轉）
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // TODO: 實作精確的螢幕座標轉網格座標
    // 暫時使用簡單計算
    const gridX = Math.floor((clickX - 300) / 64);
    const gridY = Math.floor((clickY - 150) / 32);

    // 嘗試新增物件
    const newObj: SceneObject = {
      type: 'object',
      sprite: placingObjectType,
      gridX,
      gridY
    };

    const id = editorRef.current.addObject(newObj);
    if (id) {
      refreshScene();
    }
  }, [mode, placingObjectType, refreshScene]);

  return (
    <div 
      ref={canvasRef} 
      onClick={handleCanvasClick}
      style={{ 
        width: '100%', 
        height: '100%',
        cursor: mode === 'place' ? 'crosshair' : mode === 'edit' ? 'move' : 'default'
      }} 
    />
  );
}
