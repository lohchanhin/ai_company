'use client';

import { EditorMode } from '@/lib/editor/OfficeEditor';

interface EditorToolbarProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function EditorToolbar({
  mode,
  onModeChange,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onClear,
  canUndo,
  canRedo
}: EditorToolbarProps) {
  
  const tools = [
    { id: 'view' as EditorMode, name: '檢視', icon: '👁️', color: '#3b82f6' },
    { id: 'edit' as EditorMode, name: '編輯', icon: '✏️', color: '#8b5cf6' },
    { id: 'place' as EditorMode, name: '放置', icon: '➕', color: '#10b981' }
  ];
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      padding: '16px 24px',
      borderRadius: '16px',
      border: '3px solid #475569',
      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      {/* 模式切換 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '4px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '12px'
      }}>
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => onModeChange(tool.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: mode === tool.id ? `2px solid ${tool.color}` : '2px solid transparent',
              background: mode === tool.id 
                ? `linear-gradient(135deg, ${tool.color}20, ${tool.color}40)`
                : 'transparent',
              color: mode === tool.id ? 'white' : '#94a3b8',
              fontWeight: mode === tool.id ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            className="hover:bg-white/10"
          >
            <span className="text-xl">{tool.icon}</span>
            {tool.name}
          </button>
        ))}
      </div>
      
      <div style={{
        width: '2px',
        height: '32px',
        background: '#475569'
      }}></div>
      
      {/* 操作按鈕 */}
      <div style={{
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '2px solid #475569',
            background: canUndo ? 'rgba(59,130,246,0.2)' : 'rgba(71,85,105,0.2)',
            color: canUndo ? 'white' : '#64748b',
            cursor: canUndo ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          className={canUndo ? 'hover:bg-blue-500/30' : ''}
        >
          ↶ 撤銷
        </button>
        
        <button
          onClick={onRedo}
          disabled={!canRedo}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '2px solid #475569',
            background: canRedo ? 'rgba(59,130,246,0.2)' : 'rgba(71,85,105,0.2)',
            color: canRedo ? 'white' : '#64748b',
            cursor: canRedo ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          className={canRedo ? 'hover:bg-blue-500/30' : ''}
        >
          ↷ 重做
        </button>
      </div>
      
      <div style={{
        width: '2px',
        height: '32px',
        background: '#475569'
      }}></div>
      
      {/* 檔案操作 */}
      <div style={{
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={onSave}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '2px solid #10b981',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.3))',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          className="hover:scale-105"
        >
          💾 儲存
        </button>
        
        <button
          onClick={onLoad}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '2px solid #f59e0b',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.3))',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          className="hover:scale-105"
        >
          📂 載入
        </button>
        
        <button
          onClick={onClear}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '2px solid #ef4444',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.3))',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          className="hover:scale-105"
        >
          🗑️ 清空
        </button>
      </div>
      
      {/* 快捷鍵提示 */}
      <div style={{
        marginLeft: 'auto',
        fontSize: '12px',
        color: '#94a3b8',
        display: 'flex',
        gap: '16px'
      }}>
        <span>⌘Z 撤銷</span>
        <span>⌘⇧Z 重做</span>
        <span>⌘S 儲存</span>
      </div>
    </div>
  );
}
