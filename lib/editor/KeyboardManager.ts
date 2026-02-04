/**
 * 編輯器快捷鍵系統
 */

export type KeyAction = 'undo' | 'redo' | 'save' | 'delete' | 'escape' | 'copy' | 'paste';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Command key (Mac)
  action: KeyAction;
}

export class KeyboardManager {
  private shortcuts: KeyboardShortcut[] = [];
  private callbacks: Map<KeyAction, () => void> = new Map();
  private isEnabled: boolean = true;
  
  constructor() {
    this.setupDefaultShortcuts();
    this.startListening();
  }
  
  private setupDefaultShortcuts() {
    this.shortcuts = [
      // 撤銷/重做
      { key: 'z', ctrl: true, action: 'undo' },
      { key: 'z', meta: true, action: 'undo' }, // Mac
      { key: 'z', ctrl: true, shift: true, action: 'redo' },
      { key: 'z', meta: true, shift: true, action: 'redo' }, // Mac
      { key: 'y', ctrl: true, action: 'redo' },
      
      // 儲存
      { key: 's', ctrl: true, action: 'save' },
      { key: 's', meta: true, action: 'save' }, // Mac
      
      // 刪除
      { key: 'Delete', action: 'delete' },
      { key: 'Backspace', action: 'delete' },
      
      // 取消
      { key: 'Escape', action: 'escape' },
      
      // 複製/貼上
      { key: 'c', ctrl: true, action: 'copy' },
      { key: 'c', meta: true, action: 'copy' }, // Mac
      { key: 'v', ctrl: true, action: 'paste' },
      { key: 'v', meta: true, action: 'paste' } // Mac
    ];
  }
  
  private startListening() {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled) return;
    
    // 如果在輸入框中，忽略（除了 Escape）
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      if (event.key !== 'Escape') return;
    }
    
    // 檢查是否匹配任何快捷鍵
    for (const shortcut of this.shortcuts) {
      if (this.matchShortcut(event, shortcut)) {
        event.preventDefault();
        const callback = this.callbacks.get(shortcut.action);
        if (callback) {
          callback();
        }
        break;
      }
    }
  }
  
  private matchShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    // 檢查主鍵
    if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
      return false;
    }
    
    // 檢查修飾鍵
    if (shortcut.ctrl && !event.ctrlKey) return false;
    if (shortcut.shift && !event.shiftKey) return false;
    if (shortcut.alt && !event.altKey) return false;
    if (shortcut.meta && !event.metaKey) return false;
    
    // 檢查不應該按下的修飾鍵
    if (!shortcut.ctrl && event.ctrlKey && !shortcut.meta) return false;
    if (!shortcut.shift && event.shiftKey) return false;
    if (!shortcut.alt && event.altKey) return false;
    if (!shortcut.meta && event.metaKey && !shortcut.ctrl) return false;
    
    return true;
  }
  
  /**
   * 註冊快捷鍵回調
   */
  public on(action: KeyAction, callback: () => void) {
    this.callbacks.set(action, callback);
  }
  
  /**
   * 移除快捷鍵回調
   */
  public off(action: KeyAction) {
    this.callbacks.delete(action);
  }
  
  /**
   * 啟用/停用快捷鍵
   */
  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
  
  /**
   * 銷毀
   */
  public destroy() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.callbacks.clear();
  }
}
