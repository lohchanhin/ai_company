/**
 * 辦公室編輯器狀態管理
 * 支援物件管理、碰撞檢測、撤銷/重做
 */

import { SceneObject } from '../scene-config';

export type EditorMode = 'view' | 'edit' | 'place';

export interface EditorState {
  mode: EditorMode;
  selectedObject: string | null; // 物件 ID
  placingObjectType: string | null; // 正在放置的物件類型
  sceneObjects: Map<string, SceneObject>; // ID -> 物件
  gridOccupancy: Map<string, string>; // 網格座標 -> 物件 ID
  history: EditorHistory[];
  historyIndex: number;
}

export interface EditorHistory {
  action: 'add' | 'move' | 'remove';
  objectId: string;
  before?: SceneObject;
  after?: SceneObject;
}

export class OfficeEditor {
  private state: EditorState;
  private maxHistorySize: number = 50;
  
  constructor(initialObjects: SceneObject[] = []) {
    this.state = {
      mode: 'view',
      selectedObject: null,
      placingObjectType: null,
      sceneObjects: new Map(),
      gridOccupancy: new Map(),
      history: [],
      historyIndex: -1
    };
    
    // 載入初始物件
    initialObjects.forEach((obj, index) => {
      const id = `obj_${index}_${Date.now()}`;
      this.state.sceneObjects.set(id, obj);
      this.updateGridOccupancy(id, obj.gridX, obj.gridY);
    });
  }
  
  /**
   * 設定編輯模式
   */
  public setMode(mode: EditorMode) {
    this.state.mode = mode;
    if (mode !== 'edit') {
      this.state.selectedObject = null;
    }
  }
  
  /**
   * 取得當前模式
   */
  public getMode(): EditorMode {
    return this.state.mode;
  }
  
  /**
   * 新增物件
   */
  public addObject(obj: SceneObject): string | null {
    // 檢查碰撞
    if (this.isGridOccupied(obj.gridX, obj.gridY)) {
      return null;
    }
    
    const id = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.state.sceneObjects.set(id, obj);
    this.updateGridOccupancy(id, obj.gridX, obj.gridY);
    
    // 記錄歷史
    this.addHistory({
      action: 'add',
      objectId: id,
      after: obj
    });
    
    return id;
  }
  
  /**
   * 移動物件
   */
  public moveObject(id: string, newGridX: number, newGridY: number): boolean {
    const obj = this.state.sceneObjects.get(id);
    if (!obj) return false;
    
    // 檢查新位置是否被佔用（排除自己）
    const occupyingId = this.getOccupyingObject(newGridX, newGridY);
    if (occupyingId && occupyingId !== id) {
      return false;
    }
    
    // 記錄舊狀態
    const oldObj = { ...obj };
    
    // 更新網格佔用
    this.clearGridOccupancy(id, obj.gridX, obj.gridY);
    obj.gridX = newGridX;
    obj.gridY = newGridY;
    this.updateGridOccupancy(id, newGridX, newGridY);
    
    // 記錄歷史
    this.addHistory({
      action: 'move',
      objectId: id,
      before: oldObj,
      after: obj
    });
    
    return true;
  }
  
  /**
   * 移除物件
   */
  public removeObject(id: string): boolean {
    const obj = this.state.sceneObjects.get(id);
    if (!obj) return false;
    
    this.clearGridOccupancy(id, obj.gridX, obj.gridY);
    this.state.sceneObjects.delete(id);
    
    // 記錄歷史
    this.addHistory({
      action: 'remove',
      objectId: id,
      before: obj
    });
    
    return true;
  }
  
  /**
   * 檢查網格是否被佔用
   */
  public isGridOccupied(gridX: number, gridY: number): boolean {
    const key = `${gridX},${gridY}`;
    return this.state.gridOccupancy.has(key);
  }
  
  /**
   * 取得佔用該網格的物件 ID
   */
  public getOccupyingObject(gridX: number, gridY: number): string | null {
    const key = `${gridX},${gridY}`;
    return this.state.gridOccupancy.get(key) || null;
  }
  
  /**
   * 更新網格佔用
   */
  private updateGridOccupancy(objectId: string, gridX: number, gridY: number) {
    const key = `${gridX},${gridY}`;
    this.state.gridOccupancy.set(key, objectId);
  }
  
  /**
   * 清除網格佔用
   */
  private clearGridOccupancy(objectId: string, gridX: number, gridY: number) {
    const key = `${gridX},${gridY}`;
    if (this.state.gridOccupancy.get(key) === objectId) {
      this.state.gridOccupancy.delete(key);
    }
  }
  
  /**
   * 選擇物件
   */
  public selectObject(id: string | null) {
    this.state.selectedObject = id;
  }
  
  /**
   * 取得選中物件
   */
  public getSelectedObject(): string | null {
    return this.state.selectedObject;
  }
  
  /**
   * 取得物件
   */
  public getObject(id: string): SceneObject | undefined {
    return this.state.sceneObjects.get(id);
  }
  
  /**
   * 取得所有物件
   */
  public getAllObjects(): Array<{ id: string; object: SceneObject }> {
    return Array.from(this.state.sceneObjects.entries()).map(([id, object]) => ({
      id,
      object
    }));
  }
  
  /**
   * 新增歷史記錄
   */
  private addHistory(record: EditorHistory) {
    // 清除當前位置之後的歷史
    if (this.state.historyIndex < this.state.history.length - 1) {
      this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
    }
    
    this.state.history.push(record);
    this.state.historyIndex++;
    
    // 限制歷史大小
    if (this.state.history.length > this.maxHistorySize) {
      this.state.history.shift();
      this.state.historyIndex--;
    }
  }
  
  /**
   * 撤銷
   */
  public undo(): EditorHistory | null {
    if (this.state.historyIndex < 0) return null;
    
    const record = this.state.history[this.state.historyIndex];
    this.state.historyIndex--;
    
    // 執行反向操作
    switch (record.action) {
      case 'add':
        if (record.after) {
          this.clearGridOccupancy(record.objectId, record.after.gridX, record.after.gridY);
          this.state.sceneObjects.delete(record.objectId);
        }
        break;
      
      case 'move':
        if (record.before) {
          const obj = this.state.sceneObjects.get(record.objectId);
          if (obj && record.after) {
            this.clearGridOccupancy(record.objectId, record.after.gridX, record.after.gridY);
            obj.gridX = record.before.gridX;
            obj.gridY = record.before.gridY;
            this.updateGridOccupancy(record.objectId, obj.gridX, obj.gridY);
          }
        }
        break;
      
      case 'remove':
        if (record.before) {
          this.state.sceneObjects.set(record.objectId, record.before);
          this.updateGridOccupancy(record.objectId, record.before.gridX, record.before.gridY);
        }
        break;
    }
    
    return record;
  }
  
  /**
   * 重做
   */
  public redo(): EditorHistory | null {
    if (this.state.historyIndex >= this.state.history.length - 1) return null;
    
    this.state.historyIndex++;
    const record = this.state.history[this.state.historyIndex];
    
    // 執行正向操作
    switch (record.action) {
      case 'add':
        if (record.after) {
          this.state.sceneObjects.set(record.objectId, record.after);
          this.updateGridOccupancy(record.objectId, record.after.gridX, record.after.gridY);
        }
        break;
      
      case 'move':
        if (record.after) {
          const obj = this.state.sceneObjects.get(record.objectId);
          if (obj && record.before) {
            this.clearGridOccupancy(record.objectId, record.before.gridX, record.before.gridY);
            obj.gridX = record.after.gridX;
            obj.gridY = record.after.gridY;
            this.updateGridOccupancy(record.objectId, obj.gridX, obj.gridY);
          }
        }
        break;
      
      case 'remove':
        if (record.before) {
          this.clearGridOccupancy(record.objectId, record.before.gridX, record.before.gridY);
          this.state.sceneObjects.delete(record.objectId);
        }
        break;
    }
    
    return record;
  }
  
  /**
   * 匯出場景配置
   */
  public exportScene(): SceneObject[] {
    return Array.from(this.state.sceneObjects.values());
  }
  
  /**
   * 匯入場景配置
   */
  public importScene(objects: SceneObject[]) {
    this.state.sceneObjects.clear();
    this.state.gridOccupancy.clear();
    
    objects.forEach((obj, index) => {
      const id = `obj_${index}_${Date.now()}`;
      this.state.sceneObjects.set(id, obj);
      this.updateGridOccupancy(id, obj.gridX, obj.gridY);
    });
    
    // 清除歷史
    this.state.history = [];
    this.state.historyIndex = -1;
  }
}
