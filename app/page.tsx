'use client';

import { useState } from 'react';
import { IsometricCanvas } from '@/components/IsometricCanvas';
import { Server } from '@/types';

// 模擬數據
const mockServers: Server[] = [
  {
    id: '1',
    name: '開發機',
    host: '143.198.202.94',
    port: 22,
    username: 'root',
    visual: {
      type: 'developer',
      gridX: 0,
      gridY: 0
    },
    status: {
      online: true,
      cpu: 65,
      memory: 78,
      disk: 40,
      uptime: 86400
    }
  },
  {
    id: '2',
    name: '測試機',
    host: '192.168.1.100',
    port: 22,
    username: 'root',
    visual: {
      type: 'developer',
      gridX: 2,
      gridY: 0
    },
    status: {
      online: true,
      cpu: 12,
      memory: 25,
      disk: 30,
      uptime: 43200
    }
  },
  {
    id: '3',
    name: '資料庫',
    host: '192.168.1.101',
    port: 22,
    username: 'root',
    visual: {
      type: 'database',
      gridX: 0,
      gridY: 2
    },
    status: {
      online: true,
      cpu: 95,
      memory: 98,
      disk: 75,
      uptime: 172800
    }
  },
  {
    id: '4',
    name: '前端機',
    host: '192.168.1.102',
    port: 22,
    username: 'root',
    visual: {
      type: 'web',
      gridX: 2,
      gridY: 2
    },
    status: {
      online: true,
      cpu: 45,
      memory: 60,
      disk: 50,
      uptime: 259200
    }
  }
];

export default function Home() {
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  
  // 模擬資源更新
  useState(() => {
    const interval = setInterval(() => {
      setServers(prev => prev.map(server => ({
        ...server,
        status: {
          ...server.status,
          cpu: Math.max(0, Math.min(100, server.status.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, server.status.memory + (Math.random() - 0.5) * 5))
        }
      })));
    }, 2000);
    
    return () => clearInterval(interval);
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏢 VPS 管理中心</h1>
            <p className="text-sm text-gray-500">開羅風格可視化管理工具</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              新增伺服器
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              設定
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* 左側：等距畫布 */}
        <div className="flex-1 p-4">
          <IsometricCanvas 
            servers={servers} 
            onServerClick={setSelectedServer}
          />
        </div>
        
        {/* 右側：資訊面板 */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">📊 系統總覽</h2>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">伺服器數量</div>
              <div className="text-2xl font-bold">{servers.length} 台</div>
            </div>
            
            <div className="p-3 bg-green-50 rounded">
              <div className="text-sm text-gray-600">🟢 Online</div>
              <div className="text-2xl font-bold text-green-600">
                {servers.filter(s => s.status.online).length}
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-sm text-gray-600">平均 CPU</div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(servers.reduce((sum, s) => sum + s.status.cpu, 0) / servers.length)}%
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded">
              <div className="text-sm text-gray-600">平均 RAM</div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(servers.reduce((sum, s) => sum + s.status.memory, 0) / servers.length)}%
              </div>
            </div>
          </div>
          
          {selectedServer && (
            <>
              <hr className="my-6" />
              <h3 className="text-lg font-bold mb-4">🖥️ 伺服器詳情</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">名稱</div>
                  <div className="font-medium">{selectedServer.name}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">主機</div>
                  <div className="font-mono text-sm">{selectedServer.host}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">CPU</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${selectedServer.status.cpu}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{selectedServer.status.cpu}%</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Memory</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${selectedServer.status.memory}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{selectedServer.status.memory}%</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Disk</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${selectedServer.status.disk}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{selectedServer.status.disk}%</div>
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800">
                  SSH 連線
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
