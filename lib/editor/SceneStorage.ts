/**
 * 場景儲存/載入工具
 * 使用 localStorage 儲存場景配置
 */

import { SceneObject } from '../scene-config';

const STORAGE_KEY = 'vps-office-scene';
const AUTO_SAVE_KEY = 'vps-office-scene-autosave';

export interface SavedScene {
  name: string;
  timestamp: number;
  vpsCount: number;
  objects: SceneObject[];
  version: string;
}

export class SceneStorage {
  
  /**
   * 儲存場景
   */
  static save(
    name: string,
    objects: SceneObject[],
    vpsCount: number
  ): boolean {
    try {
      const scene: SavedScene = {
        name,
        timestamp: Date.now(),
        vpsCount,
        objects,
        version: '1.0.0'
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scene));
      return true;
    } catch (error) {
      console.error('儲存失敗:', error);
      return false;
    }
  }
  
  /**
   * 載入場景
   */
  static load(): SavedScene | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const scene: SavedScene = JSON.parse(data);
      return scene;
    } catch (error) {
      console.error('載入失敗:', error);
      return null;
    }
  }
  
  /**
   * 自動儲存
   */
  static autoSave(objects: SceneObject[], vpsCount: number): boolean {
    try {
      const scene: SavedScene = {
        name: 'Auto Save',
        timestamp: Date.now(),
        vpsCount,
        objects,
        version: '1.0.0'
      };
      
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(scene));
      return true;
    } catch (error) {
      console.error('自動儲存失敗:', error);
      return false;
    }
  }
  
  /**
   * 載入自動儲存
   */
  static loadAutoSave(): SavedScene | null {
    try {
      const data = localStorage.getItem(AUTO_SAVE_KEY);
      if (!data) return null;
      
      const scene: SavedScene = JSON.parse(data);
      return scene;
    } catch (error) {
      console.error('載入自動儲存失敗:', error);
      return null;
    }
  }
  
  /**
   * 匯出為 JSON
   */
  static exportJSON(objects: SceneObject[], vpsCount: number): string {
    const scene: SavedScene = {
      name: 'Exported Scene',
      timestamp: Date.now(),
      vpsCount,
      objects,
      version: '1.0.0'
    };
    
    return JSON.stringify(scene, null, 2);
  }
  
  /**
   * 從 JSON 匯入
   */
  static importJSON(json: string): SavedScene | null {
    try {
      const scene: SavedScene = JSON.parse(json);
      
      // 驗證格式
      if (!scene.objects || !Array.isArray(scene.objects)) {
        throw new Error('Invalid scene format');
      }
      
      return scene;
    } catch (error) {
      console.error('匯入失敗:', error);
      return null;
    }
  }
  
  /**
   * 下載為檔案
   */
  static downloadJSON(objects: SceneObject[], vpsCount: number, filename: string = 'office-scene.json') {
    const json = this.exportJSON(objects, vpsCount);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  /**
   * 從檔案上傳
   */
  static async uploadJSON(file: File): Promise<SavedScene | null> {
    try {
      const text = await file.text();
      return this.importJSON(text);
    } catch (error) {
      console.error('上傳失敗:', error);
      return null;
    }
  }
  
  /**
   * 清除儲存
   */
  static clear() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTO_SAVE_KEY);
  }
  
  /**
   * 取得儲存資訊
   */
  static getInfo(): { hasSave: boolean; hasAutoSave: boolean; lastSave?: number; lastAutoSave?: number } {
    const save = this.load();
    const autoSave = this.loadAutoSave();
    
    return {
      hasSave: !!save,
      hasAutoSave: !!autoSave,
      lastSave: save?.timestamp,
      lastAutoSave: autoSave?.timestamp
    };
  }
}
