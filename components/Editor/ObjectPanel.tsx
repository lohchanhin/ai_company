'use client';

import { useState } from 'react';

export interface ObjectPanelItem {
  id: string;
  name: string;
  category: 'furniture' | 'object' | 'decoration';
  sprite: string;
  icon?: string;
}

interface ObjectPanelProps {
  items: ObjectPanelItem[];
  onSelectItem: (item: ObjectPanelItem) => void;
  selectedItemId: string | null;
}

export function ObjectPanel({ items, onSelectItem, selectedItemId }: ObjectPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: '全部', icon: '🏢' },
    { id: 'furniture', name: '家具', icon: '🪑' },
    { id: 'object', name: '物件', icon: '📦' },
    { id: 'decoration', name: '裝飾', icon: '🌿' }
  ];
  
  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      borderRadius: '16px',
      border: '3px solid #9ca3af',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* 標題 */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '16px',
        borderBottom: '3px solid #4c1d95'
      }}>
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          物件庫
        </h3>
      </div>
      
      {/* 分類標籤 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '12px',
        background: 'rgba(255,255,255,0.5)',
        borderBottom: '2px solid #d1d5db'
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: activeCategory === cat.id ? '2px solid #6366f1' : '2px solid transparent',
              background: activeCategory === cat.id 
                ? 'linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 100%)'
                : 'white',
              fontWeight: activeCategory === cat.id ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '14px'
            }}
            className="hover:scale-105"
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>
      
      {/* 物件網格 */}
      <div style={{
        padding: '12px',
        maxHeight: '400px',
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        {filteredItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: selectedItemId === item.id ? '3px solid #6366f1' : '2px solid #d1d5db',
              background: selectedItemId === item.id 
                ? 'linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 100%)'
                : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              boxShadow: selectedItemId === item.id 
                ? '0 4px 12px rgba(99,102,241,0.3)'
                : '0 2px 6px rgba(0,0,0,0.1)'
            }}
            className="hover:scale-105 hover:shadow-lg"
          >
            <div style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              borderRadius: '8px'
            }}>
              {item.icon || '📦'}
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: selectedItemId === item.id ? 'bold' : 'normal',
              color: selectedItemId === item.id ? '#4c1d95' : '#374151',
              textAlign: 'center'
            }}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
      
      {/* 提示 */}
      <div style={{
        padding: '12px',
        background: 'rgba(99,102,241,0.1)',
        borderTop: '2px solid #c7d2fe',
        fontSize: '12px',
        color: '#4c1d95',
        textAlign: 'center'
      }}>
        💡 點擊物件後，在場景中點擊放置
      </div>
    </div>
  );
}
