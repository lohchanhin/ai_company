'use client';

import { useState } from 'react';
import { EditableOfficeCanvas } from '@/components/IsometricCanvas/EditableOfficeCanvas';
import { EditorToolbar } from '@/components/Editor/EditorToolbar';
import { ObjectPanel, ObjectPanelItem } from '@/components/Editor/ObjectPanel';
import { EditorMode } from '@/lib/editor/OfficeEditor';

import { SceneStorage } from '@/lib/editor/SceneStorage';

// 可用物件列表
const availableObjects: ObjectPanelItem[] = [
  // 家具
  { id: 'desk', name: '辦公桌', category: 'furniture', sprite: 'desk', icon: '🪑' },
  { id: 'chair', name: '椅子', category: 'furniture', sprite: 'chair', icon: '💺' },
  { id: 'meeting-table', name: '會議桌', category: 'furniture', sprite: 'meeting-table', icon: '🪑' },
  { id: 'bookshelf', name: '書架', category: 'furniture', sprite: 'bookshelf', icon: '📚' },
  { id: 'file-cabinet', name: '文件櫃', category: 'furniture', sprite: 'file-cabinet', icon: '🗄️' },
  { id: 'water-dispenser', name: '飲水機', category: 'furniture', sprite: 'water-dispenser', icon: '💧' },
  { id: 'printer', name: '印表機', category: 'furniture', sprite: 'printer', icon: '🖨️' },
  
  // 物件
  { id: 'monitor', name: '螢幕', category: 'object', sprite: 'object-monitor', icon: '🖥️' },
  { id: 'keyboard', name: '鍵盤', category: 'object', sprite: 'object-keyboard', icon: '⌨️' },
  { id: 'whiteboard', name: '白板', category: 'object', sprite: 'whiteboard', icon: '📋' },
  { id: 'clock', name: '時鐘', category: 'object', sprite: 'clock', icon: '🕐' },
  { id: 'coffee-machine', name: '咖啡機', category: 'object', sprite: 'coffee-machine', icon: '☕' },
  { id: 'game-console', name: '遊戲機', category: 'object', sprite: 'game-console', icon: '🎮' },
  { id: 'window', name: '窗戶', category: 'object', sprite: 'window', icon: '🪟' },
  { id: 'door', name: '門', category: 'object', sprite: 'door', icon: '🚪' },
  
  // 裝飾
  { id: 'plant-small', name: '小植物', category: 'decoration', sprite: 'plant-small', icon: '🌱' },
  { id: 'plant-medium', name: '中植物', category: 'decoration', sprite: 'plant-medium', icon: '🪴' },
  { id: 'plant-large', name: '大植物', category: 'decoration', sprite: 'plant-large', icon: '🌿' },
  { id: 'sofa', name: '沙發', category: 'decoration', sprite: 'sofa', icon: '🛋️' },
  { id: 'lamp', name: '燈', category: 'decoration', sprite: 'lamp', icon: '💡' }
];

export default function EditorPage() {
  const [mode, setMode] = useState<EditorMode>('view');
  const [selectedItem, setSelectedItem] = useState<ObjectPanelItem | null>(null);
  const [vpsCount, setVpsCount] = useState(8);
  const [editorRef, setEditorRef] = useState<any>(null);

  const handleModeChange = (newMode: EditorMode) => {
    setMode(newMode);
    if (newMode !== 'place') {
      setSelectedItem(null);
    }
  };

  const handleSelectItem = (item: ObjectPanelItem) => {
    setSelectedItem(item);
    setMode('place');
  };

  const handleSave = () => {
    if (!editorRef) {
      alert('編輯器尚未初始化');
      return;
    }
    
    const objects = editorRef.exportScene();
    const success = SceneStorage.save('My Office', objects, vpsCount);
    
    if (success) {
      alert('✅ 場景已儲存！');
      // 同時下載 JSON
      SceneStorage.downloadJSON(objects, vpsCount, `office-${Date.now()}.json`);
    } else {
      alert('❌ 儲存失敗');
    }
  };

  const handleLoad = () => {
    const scene = SceneStorage.load();
    if (!scene) {
      alert('沒有已儲存的場景');
      return;
    }
    
    if (confirm(`載入場景 "${scene.name}"？\n最後儲存：${new Date(scene.timestamp).toLocaleString()}`)) {
      window.location.reload(); // 簡化：重新載入頁面
    }
  };

  const handleClear = () => {
    if (confirm('確定要清空所有物件嗎？此操作無法復原。')) {
      if (editorRef) {
        editorRef.clearAll();
        editorRef.refresh();
        SceneStorage.clear();
        alert('✅ 已清空所有物件');
      } else {
        SceneStorage.clear();
        window.location.reload();
      }
    }
  };

  const handleAutoLayout = () => {
    if (confirm(`根據 ${vpsCount} 台 VPS 自動佈局？`)) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #ede9fe 50%, #fce7f3 100%)' 
    }}>
      {/* 頂部導航 */}
      <header style={{ 
        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
        padding: '24px 40px',
        borderBottom: '4px solid rgba(0,0,0,0.1)'
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎨</span>
            <div>
              <h1 className="text-3xl font-bold text-white">辦公室編輯器</h1>
              <p className="text-white/90 text-sm mt-1">拖放設計你的 VPS 監控辦公室</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '12px 20px',
              borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              <label className="text-white font-bold text-sm">
                VPS 數量:
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={vpsCount}
                  onChange={(e) => setVpsCount(parseInt(e.target.value) || 1)}
                  style={{
                    width: '60px',
                    marginLeft: '8px',
                    padding: '6px',
                    borderRadius: '6px',
                    border: '2px solid white',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                />
              </label>
            </div>
            
            <button
              onClick={handleAutoLayout}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '2px solid white',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover:bg-white/30 hover:scale-105"
            >
              🤖 自動佈局
            </button>
          </div>
        </div>
      </header>

      {/* 工具欄 */}
      <div style={{ padding: '16px 24px' }}>
        <EditorToolbar
          mode={mode}
          onModeChange={handleModeChange}
          onUndo={() => {}}
          onRedo={() => {}}
          onSave={handleSave}
          onLoad={handleLoad}
          onClear={handleClear}
          canUndo={true}
          canRedo={true}
        />
      </div>

      {/* 主要內容 */}
      <div className="flex h-[calc(100vh-280px)] gap-6 px-6">
        {/* 左側：Canvas */}
        <div className="flex-1" style={{
          background: 'white',
          borderRadius: '16px',
          border: '3px solid #d1d5db',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <EditableOfficeCanvas
            mode={mode}
            onModeChange={handleModeChange}
            placingObjectType={selectedItem?.sprite || null}
            vpsCount={vpsCount}
            onEditorReady={setEditorRef}
          />
        </div>

        {/* 右側：物件面板 */}
        <div style={{ width: '320px' }}>
          <ObjectPanel
            items={availableObjects}
            onSelectItem={handleSelectItem}
            selectedItemId={selectedItem?.id || null}
          />
          
          {/* 提示卡片 */}
          <div style={{
            marginTop: '16px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%)',
            borderRadius: '12px',
            border: '3px solid #fbbf24',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(251,191,36,0.3)'
          }}>
            <h4 className="font-bold text-amber-900 mb-2">💡 操作提示</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• <strong>檢視模式</strong>：瀏覽場景</li>
              <li>• <strong>編輯模式</strong>：拖動物件</li>
              <li>• <strong>放置模式</strong>：點擊放置</li>
              <li>• <strong>Delete</strong>：刪除選中物件</li>
              <li>• <strong>⌘Z</strong>：撤銷操作</li>
              <li>• <strong>⌘S</strong>：儲存場景</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
