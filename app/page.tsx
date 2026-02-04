'use client';

import { useState } from 'react';
import { VPSOfficeCanvas } from '@/components/IsometricCanvas/VPSOfficeCanvas';
import { Server } from '@/types';

// 任務類型
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed';
  serverId?: string;
  progress?: number;
  startTime?: number;
  estimatedTime?: number;
}

// 豐富的辦公室場景數據
const mockServers: Server[] = [
  // 第一排：開發區
  {
    id: '1',
    name: '開發機',
    host: '143.198.202.94',
    port: 22,
    username: 'root',
    visual: { type: 'developer', gridX: 1, gridY: 0 },
    status: { online: true, cpu: 65, memory: 78, disk: 40, uptime: 86400 },
    currentTask: '部署應用'
  },
  {
    id: '2',
    name: '測試機',
    host: '192.168.1.100',
    port: 22,
    username: 'root',
    visual: { type: 'developer', gridX: 3, gridY: 0 },
    status: { online: true, cpu: 12, memory: 25, disk: 30, uptime: 43200 }
  },
  {
    id: '5',
    name: '前端機',
    host: '192.168.1.102',
    port: 22,
    username: 'root',
    visual: { type: 'web', gridX: 5, gridY: 0 },
    status: { online: true, cpu: 45, memory: 60, disk: 50, uptime: 259200 }
  },
  
  // 第二排：伺服器區
  {
    id: '3',
    name: '資料庫',
    host: '192.168.1.101',
    port: 22,
    username: 'root',
    visual: { type: 'database', gridX: 1, gridY: 2 },
    status: { online: true, cpu: 95, memory: 98, disk: 75, uptime: 172800 },
    currentTask: '備份資料'
  },
  {
    id: '4',
    name: 'API伺服器',
    host: '192.168.1.103',
    port: 22,
    username: 'root',
    visual: { type: 'web', gridX: 3, gridY: 2 },
    status: { online: true, cpu: 55, memory: 70, disk: 45, uptime: 345600 }
  },
  {
    id: '6',
    name: '快取伺服器',
    host: '192.168.1.104',
    port: 22,
    username: 'root',
    visual: { type: 'generic', gridX: 5, gridY: 2 },
    status: { online: true, cpu: 30, memory: 85, disk: 20, uptime: 432000 }
  },
  
  // 第三排：備份區
  {
    id: '7',
    name: '備份機',
    host: '192.168.1.105',
    port: 22,
    username: 'root',
    visual: { type: 'database', gridX: 1, gridY: 4 },
    status: { online: true, cpu: 15, memory: 40, disk: 90, uptime: 518400 }
  },
  {
    id: '8',
    name: '監控機',
    host: '192.168.1.106',
    port: 22,
    username: 'root',
    visual: { type: 'generic', gridX: 3, gridY: 4 },
    status: { online: true, cpu: 25, memory: 35, disk: 25, uptime: 604800 }
  }
];

const mockTasks: Task[] = [
  { id: 't1', title: '部署 VVE 應用', description: '部署前端到開發機', status: 'running', serverId: '1', progress: 65, startTime: Date.now() - 30000, estimatedTime: 60000 },
  { id: 't2', title: '備份資料庫', description: '每日自動備份', status: 'running', serverId: '3', progress: 80, startTime: Date.now() - 120000, estimatedTime: 180000 },
  { id: 't3', title: '清理日誌檔案', description: '清理超過 30 天的日誌', status: 'pending', serverId: '2' },
  { id: 't4', title: '更新系統套件', description: 'apt-get update && upgrade', status: 'pending', serverId: '5' },
  { id: 't5', title: '檢查磁碟空間', description: '已完成', status: 'completed', serverId: '1' },
  { id: 't6', title: '重啟 Nginx', description: '已完成', status: 'completed', serverId: '5' },
  { id: 't7', title: '優化資料庫索引', description: '已完成', status: 'completed', serverId: '3' }
];

export default function Home() {
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
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
      
      // 更新任務進度
      setTasks(prev => prev.map(task => {
        if (task.status === 'running' && task.progress !== undefined) {
          const newProgress = Math.min(100, task.progress + Math.random() * 5);
          if (newProgress >= 100) {
            return { ...task, status: 'completed', progress: 100 };
          }
          return { ...task, progress: newProgress };
        }
        return task;
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  });
  
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const runningTasks = tasks.filter(t => t.status === 'running');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  const avgCpu = Math.round(servers.reduce((sum, s) => sum + s.status.cpu, 0) / servers.length);
  const avgMemory = Math.round(servers.reduce((sum, s) => sum + s.status.memory, 0) / servers.length);
  const avgDisk = Math.round(servers.reduce((sum, s) => sum + s.status.disk, 0) / servers.length);
  
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
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              新增伺服器
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              新增任務
            </button>
            <a 
              href="/sprites-gallery.html" 
              target="_blank"
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              素材畫廊
            </a>
          </div>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-88px)]">
        {/* 左側：等距辦公室 Canvas (固定 70%) */}
        <div className="w-[70%] p-6">
          <div className="h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <VPSOfficeCanvas />
          </div>
        </div>
        
        {/* 右側：任務 + 資源面板 (固定 30%) */}
        <div className="w-[30%] bg-white border-l border-gray-200 overflow-y-auto">
          
          {/* 任務清單區 */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              📋 任務清單
              <span className="ml-auto text-sm font-normal text-gray-500">
                {runningTasks.length} 進行中
              </span>
            </h2>
            
            {/* 進行中的任務 */}
            {runningTasks.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-semibold text-blue-600 mb-2">🔄 進行中</div>
                <div className="space-y-2">
                  {runningTasks.map(task => (
                    <div key={task.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="text-xs text-blue-600 font-mono">
                          {task.progress?.toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">{task.description}</div>
                      <div className="w-full bg-blue-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${task.progress || 0}%` }}
                        />
                      </div>
                      {task.serverId && (
                        <div className="text-xs text-gray-500 mt-1">
                          🖥️ {servers.find(s => s.id === task.serverId)?.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 待執行的任務 */}
            {pendingTasks.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-semibold text-yellow-600 mb-2">⏳ 待執行</div>
                <div className="space-y-2">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="font-medium text-sm mb-1">{task.title}</div>
                      <div className="text-xs text-gray-600">{task.description}</div>
                      {task.serverId && (
                        <div className="text-xs text-gray-500 mt-1">
                          🖥️ {servers.find(s => s.id === task.serverId)?.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 已完成的任務 */}
            {completedTasks.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-green-600 mb-2">✅ 已完成</div>
                <div className="space-y-2">
                  {completedTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="p-3 bg-green-50 border border-green-200 rounded opacity-75">
                      <div className="font-medium text-sm mb-1">{task.title}</div>
                      <div className="text-xs text-gray-600">{task.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 資源監控區 */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4">📊 資源監控</h2>
            
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">平均 CPU</span>
                  <span className="text-lg font-bold text-blue-600">{avgCpu}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${avgCpu}%` }}
                  />
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">平均 RAM</span>
                  <span className="text-lg font-bold text-purple-600">{avgMemory}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${avgMemory}%` }}
                  />
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">平均磁碟</span>
                  <span className="text-lg font-bold text-green-600">{avgDisk}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${avgDisk}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* 伺服器列表區 */}
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">🖥️ 伺服器列表</h2>
            
            <div className="space-y-2">
              {servers.map(server => (
                <div 
                  key={server.id}
                  onClick={() => setSelectedServer(server)}
                  className={`p-3 rounded border-2 cursor-pointer transition ${
                    selectedServer?.id === server.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{server.name}</div>
                    <div className="text-xl">
                      {server.status.online ? '🟢' : '⚫'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 font-mono mb-2">
                    {server.host}
                  </div>
                  {server.currentTask && (
                    <div className="text-xs text-blue-600 font-medium">
                      🔄 {server.currentTask}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2 text-xs">
                    <div className="flex-1 bg-white rounded px-2 py-1">
                      <span className="text-gray-500">CPU</span>
                      <span className="ml-1 font-mono">{server.status.cpu.toFixed(0)}%</span>
                    </div>
                    <div className="flex-1 bg-white rounded px-2 py-1">
                      <span className="text-gray-500">RAM</span>
                      <span className="ml-1 font-mono">{server.status.memory.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
