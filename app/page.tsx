'use client';

import { useState } from 'react';
import { VPSOfficeCanvas } from '@/components/IsometricCanvas/VPSOfficeCanvas';

export default function Home() {
  const [selectedServer, setSelectedServer] = useState<any>(null);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #ede9fe 50%, #fce7f3 100%)' }}>
      {/* 🎮 開羅風格頂部狀態欄 */}
      <header style={{ 
        background: 'linear-gradient(90deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)',
        borderBottom: '4px solid #d97706',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo + 標題 */}
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce">🏢</div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">VPS 管理中心</h1>
                <p className="text-sm text-yellow-100">開羅風格可視化管理工具</p>
              </div>
            </div>
            
            {/* 遊戲風格狀態欄 */}
            <div className="flex items-center gap-6">
              {/* 金錢 */}
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border-2 border-yellow-500 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <div>
                    <div className="text-xs text-gray-500">總資金</div>
                    <div className="text-lg font-bold text-yellow-600">¥ 1,234,567</div>
                  </div>
                </div>
              </div>
              
              {/* 員工數 */}
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border-2 border-blue-500 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="text-xs text-gray-500">員工數量</div>
                    <div className="text-lg font-bold text-blue-600">12 / 20</div>
                  </div>
                </div>
              </div>
              
              {/* 滿意度 */}
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border-2 border-green-500 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😊</span>
                  <div>
                    <div className="text-xs text-gray-500">滿意度</div>
                    <div className="text-lg font-bold text-green-600">98%</div>
                  </div>
                </div>
              </div>
              
              {/* 按鈕組 */}
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg border-b-4 border-blue-800 font-bold">
                  ➕ 新增伺服器
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg border-b-4 border-green-800 font-bold">
                  📋 新增任務
                </button>
                <a 
                  href="/sprites-gallery.html" 
                  target="_blank"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg border-b-4 border-purple-800 font-bold"
                >
                  🎨 素材畫廊
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-88px)]">
        {/* 左側：等距辦公室 Canvas (固定 70%) */}
        <div className="w-[70%] p-6">
          <div className="h-full bg-white rounded-2xl shadow-2xl border-4 border-yellow-400 overflow-hidden relative">
            {/* 裝飾性角落 */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-transparent"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-400 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-400 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-yellow-400 to-transparent"></div>
            
            <VPSOfficeCanvas />
          </div>
        </div>
        
        {/* 右側：任務 + 資源面板 (固定 30%) */}
        <div className="w-[30%] bg-gradient-to-b from-purple-50 to-blue-50 overflow-y-auto">
          
          {/* 📋 任務清單區 */}
          <div className="p-4 border-b-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📋</span>
              <h2 className="text-xl font-bold text-purple-800">任務清單</h2>
              <span className="ml-auto px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-md animate-pulse">
                2 進行中
              </span>
            </div>
            
            <div className="space-y-3">
              {/* 進行中任務 */}
              <div style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
                border: '3px solid #3b82f6',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                transition: 'all 0.3s ease'
              }} className="transform hover:scale-105">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <div className="flex-1">
                    <div className="font-bold text-blue-900 mb-1">部署 VVE 應用</div>
                    <div className="text-sm text-blue-700 mb-2">部署前端到開發機</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>開發機</span>
                      <span className="text-xs text-blue-600 font-bold">73%</span>
                    </div>
                    {/* 進度條 */}
                    <div style={{
                      width: '100%',
                      height: '12px',
                      background: '#bfdbfe',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        height: '100%',
                        width: '73%',
                        background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                        borderRadius: '9999px',
                        transition: 'width 0.5s ease',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s infinite'
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)',
                border: '3px solid #eab308',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(234,179,8,0.3)',
                transition: 'all 0.3s ease'
              }} className="transform hover:scale-105">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💾</span>
                  <div className="flex-1">
                    <div className="font-bold text-yellow-900 mb-1">備份資料庫</div>
                    <div className="text-sm text-yellow-700 mb-2">每日自動備份</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{
                        background: '#eab308',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>資料庫</span>
                      <span className="text-xs text-yellow-600 font-bold">90%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      background: '#fde68a',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        height: '100%',
                        width: '90%',
                        background: 'linear-gradient(90deg, #eab308 0%, #f97316 100%)',
                        borderRadius: '9999px',
                        transition: 'width 0.5s ease',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s infinite'
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 待執行任務 */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl opacity-50">⏳</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-700 mb-1">清理日誌檔案</div>
                    <div className="text-sm text-gray-500">清理超過 30 天的日誌</div>
                    <span className="inline-block mt-2 text-xs px-3 py-1 bg-gray-300 text-gray-600 rounded-full font-bold">測試機</span>
                  </div>
                </div>
              </div>
              
              {/* 完成任務 */}
              <div className="bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-400 rounded-xl p-4 shadow-md opacity-75 hover:opacity-100 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div className="flex-1">
                    <div className="font-bold text-green-900 mb-1">更新系統套件</div>
                    <div className="text-sm text-green-700">apt-get update && upgrade</div>
                    <span className="inline-block mt-2 text-xs px-3 py-1 bg-green-500 text-white rounded-full font-bold">前端機</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 📊 資源監控區 */}
          <div className="p-4 border-b-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📊</span>
              <h2 className="text-xl font-bold text-blue-800">資源監控</h2>
            </div>
            
            <div className="space-y-4">
              {/* CPU */}
              <div style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
                border: '3px solid #3b82f6',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 6px 16px rgba(59,130,246,0.4)'
              }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <span className="font-bold text-blue-900">平均 CPU</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">46%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '16px',
                  background: '#bfdbfe',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  <div style={{
                    height: '100%',
                    width: '46%',
                    background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
                    borderRadius: '9999px',
                    transition: 'width 0.7s ease',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255,255,255,0.3)',
                      animation: 'pulse 2s infinite'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* RAM */}
              <div style={{
                background: 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%)',
                border: '3px solid #a855f7',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 6px 16px rgba(168,85,247,0.4)'
              }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💾</span>
                    <span className="font-bold text-purple-900">平均 RAM</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">63%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '16px',
                  background: '#e9d5ff',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  <div style={{
                    height: '100%',
                    width: '63%',
                    background: 'linear-gradient(90deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)',
                    borderRadius: '9999px',
                    transition: 'width 0.7s ease',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255,255,255,0.3)',
                      animation: 'pulse 2s infinite'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* 磁碟 */}
              <div style={{
                background: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
                border: '3px solid #22c55e',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 6px 16px rgba(34,197,94,0.4)'
              }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💿</span>
                    <span className="font-bold text-green-900">平均磁碟</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">47%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '16px',
                  background: '#bbf7d0',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  <div style={{
                    height: '100%',
                    width: '47%',
                    background: 'linear-gradient(90deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)',
                    borderRadius: '9999px',
                    transition: 'width 0.7s ease',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255,255,255,0.3)',
                      animation: 'pulse 2s infinite'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 💻 伺服器列表 */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💻</span>
              <h2 className="text-xl font-bold text-gray-800">伺服器列表</h2>
            </div>
            
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-400 rounded-xl p-3 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="flex-1">
                    <div className="font-bold text-green-900">開發機</div>
                    <div className="text-xs text-green-700">143.198.202.94</div>
                  </div>
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
