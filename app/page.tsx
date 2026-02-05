'use client';

import { useMemo, useState } from 'react';
import { VPSOfficeCanvas } from '@/components/IsometricCanvas/VPSOfficeCanvas';

type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: '待辦',
  in_progress: '進行中',
  blocked: '受阻',
  done: '完成',
};

const MOCK_TASKS = [
  {
    id: 'task-001',
    title: '部署前端到開發機',
    assignee: 'Alice',
    manager: 'Grace',
    status: 'in_progress' as TaskStatus,
    progress: 73,
    priority: 'high',
    updatedAt: '10:40',
  },
  {
    id: 'task-002',
    title: '備份資料庫',
    assignee: 'Henry',
    manager: 'Grace',
    status: 'in_progress' as TaskStatus,
    progress: 90,
    priority: 'medium',
    updatedAt: '10:20',
  },
  {
    id: 'task-003',
    title: '清理日誌檔案',
    assignee: 'Eve',
    manager: 'Grace',
    status: 'todo' as TaskStatus,
    progress: 0,
    priority: 'low',
    updatedAt: '09:50',
  },
  {
    id: 'task-004',
    title: '更新系統套件',
    assignee: 'Bob',
    manager: 'Grace',
    status: 'done' as TaskStatus,
    progress: 100,
    priority: 'medium',
    updatedAt: '昨天',
  },
  {
    id: 'task-005',
    title: '配置監控告警',
    assignee: 'Iris',
    manager: 'Grace',
    status: 'blocked' as TaskStatus,
    progress: 40,
    priority: 'high',
    updatedAt: '10:05',
    blockedReason: '等待權限設定',
  },
];

const MOCK_PEOPLE = [
  { id: 'emp-001', name: 'Alice', role: '工程師', manager: 'Grace', nodeRef: 'openclaw-node-abc', status: 'idle' },
  { id: 'emp-002', name: 'Bob', role: '前端', manager: 'Grace', nodeRef: 'openclaw-node-bcd', status: 'busy' },
  { id: 'emp-003', name: 'Eve', role: 'QA', manager: 'Grace', nodeRef: 'openclaw-node-cde', status: 'idle' },
  { id: 'emp-004', name: 'Henry', role: 'DBA', manager: 'Grace', nodeRef: 'openclaw-node-def', status: 'rest' },
];

const MOCK_VM_SPEC = {
  vCPU: 8,
  ramGB: 16,
  diskGB: 200,
  netMbps: 1000,
};

const MOCK_METRICS = [
  { label: 'CPU', value: 46, status: 'normal' },
  { label: 'RAM', value: 63, status: 'warn' },
  { label: 'Disk', value: 47, status: 'normal' },
  { label: 'Net', value: 22, status: 'normal' },
];

const METRIC_COLORS: Record<string, string> = {
  normal: 'from-emerald-400 to-emerald-600',
  warn: 'from-amber-400 to-amber-600',
  crit: 'from-rose-500 to-rose-700',
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'people' | 'resources' | 'layout'>('tasks');
  const [filters, setFilters] = useState({
    status: 'all',
    assignee: '',
    manager: '',
    priority: 'all',
    keyword: '',
  });

  const filteredTasks = useMemo(() => {
    return MOCK_TASKS.filter((task) => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.assignee && !task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())) return false;
      if (filters.manager && !task.manager.toLowerCase().includes(filters.manager.toLowerCase())) return false;
      if (filters.keyword && !task.title.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
      return true;
    });
  }, [filters]);

  const groupedTasks = useMemo(() => {
    return filteredTasks.reduce<Record<TaskStatus, typeof MOCK_TASKS>>(
      (acc, task) => {
        acc[task.status].push(task);
        return acc;
      },
      {
        todo: [],
        in_progress: [],
        blocked: [],
        done: [],
      }
    );
  }, [filteredTasks]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #ede9fe 50%, #fce7f3 100%)' }}>
      {/* 簡化頂部導航 */}
      <header style={{ 
        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
        padding: '24px 40px',
        borderBottom: '4px solid rgba(0,0,0,0.1)'
      }}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">🏢</span>
          <div>
            <h1 className="text-3xl font-bold text-white">VPS 管理中心</h1>
            <p className="text-white/90 text-sm mt-1">開羅風格可視化管理工具</p>
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
        
        {/* 右側：任務 / 人員 / 資源 / 佈局面板 */}
        <div className="w-[30%] bg-gradient-to-b from-purple-50 to-blue-50 overflow-y-auto border-l-4 border-yellow-200">
          <div className="sticky top-0 z-10 bg-gradient-to-b from-purple-100 to-blue-100 border-b-2 border-purple-200 p-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                className={`px-3 py-2 rounded-full text-sm font-bold ${activeTab === 'tasks' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-700'}`}
              >
                Tasks
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('people')}
                className={`px-3 py-2 rounded-full text-sm font-bold ${activeTab === 'people' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-700'}`}
              >
                People
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-2 rounded-full text-sm font-bold ${activeTab === 'resources' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-emerald-700'}`}
              >
                Resources
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('layout')}
                className={`px-3 py-2 rounded-full text-sm font-bold ${activeTab === 'layout' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-amber-700'}`}
              >
                Layout
              </button>
            </div>
          </div>

          {activeTab === 'tasks' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📋</span>
                <h2 className="text-xl font-bold text-purple-800">任務清單</h2>
                <span className="ml-auto px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-md">
                  {groupedTasks.in_progress.length} 進行中
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  className="rounded-lg border border-purple-200 px-3 py-2"
                  value={filters.status}
                  onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
                >
                  <option value="all">全部狀態</option>
                  <option value="todo">待辦</option>
                  <option value="in_progress">進行中</option>
                  <option value="blocked">受阻</option>
                  <option value="done">完成</option>
                </select>
                <select
                  className="rounded-lg border border-purple-200 px-3 py-2"
                  value={filters.priority}
                  onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}
                >
                  <option value="all">全部優先級</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
                <input
                  className="rounded-lg border border-purple-200 px-3 py-2"
                  placeholder="指派者"
                  value={filters.assignee}
                  onChange={(event) => setFilters((prev) => ({ ...prev, assignee: event.target.value }))}
                />
                <input
                  className="rounded-lg border border-purple-200 px-3 py-2"
                  placeholder="主管"
                  value={filters.manager}
                  onChange={(event) => setFilters((prev) => ({ ...prev, manager: event.target.value }))}
                />
                <input
                  className="col-span-2 rounded-lg border border-purple-200 px-3 py-2"
                  placeholder="關鍵字"
                  value={filters.keyword}
                  onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                />
              </div>

              {(['todo', 'in_progress', 'blocked', 'done'] as TaskStatus[]).map((status) => (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-700">{STATUS_LABELS[status]}</h3>
                    <span className="text-xs text-gray-500">{groupedTasks[status].length} 項</span>
                  </div>
                  {groupedTasks[status].map((task) => (
                    <div key={task.id} className="rounded-2xl border-2 border-white/80 bg-white/80 p-4 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-gray-800">{task.title}</div>
                        <span className="text-xs text-gray-500">{task.updatedAt}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700">{task.assignee}</span>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">{task.manager}</span>
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">{task.priority}</span>
                      </div>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-blue-500" style={{ width: `${task.progress}%` }} />
                      </div>
                      {task.status === 'blocked' && task.blockedReason && (
                        <div className="mt-2 text-xs text-rose-600">原因：{task.blockedReason}</div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'people' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧑‍💻</span>
                <h2 className="text-xl font-bold text-blue-800">人員列表</h2>
                <button type="button" className="ml-auto rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                  新增員工
                </button>
              </div>
              <div className="space-y-3">
                {MOCK_PEOPLE.map((person) => (
                  <div key={person.id} className="rounded-2xl border-2 border-blue-100 bg-white p-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-gray-800">{person.name}</div>
                      <span className="text-xs text-gray-500">{person.status}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">角色：{person.role}</div>
                    <div className="mt-1 text-xs text-gray-600">主管：{person.manager}</div>
                    <div className="mt-1 text-xs text-gray-500">Node：{person.nodeRef}</div>
                    <div className="mt-3 flex gap-2 text-xs">
                      <button type="button" className="rounded-full border border-blue-200 px-3 py-1 text-blue-700">
                        綁定座位
                      </button>
                      <button type="button" className="rounded-full border border-red-200 px-3 py-1 text-red-600">
                        移除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <h2 className="text-xl font-bold text-emerald-800">資源監控</h2>
              </div>
              <div className="rounded-2xl border-2 border-emerald-100 bg-white p-4 shadow-md">
                <div className="text-sm font-bold text-gray-700">VM 規格</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>vCPU：{MOCK_VM_SPEC.vCPU}</div>
                  <div>RAM：{MOCK_VM_SPEC.ramGB}GB</div>
                  <div>Disk：{MOCK_VM_SPEC.diskGB}GB</div>
                  <div>Net：{MOCK_VM_SPEC.netMbps}Mbps</div>
                </div>
              </div>
              <div className="space-y-3">
                {MOCK_METRICS.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border-2 border-white bg-white/90 p-4 shadow-md">
                    <div className="flex items-center justify-between text-sm font-bold text-gray-700">
                      <span>{metric.label}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className={`h-full rounded-full bg-gradient-to-r ${METRIC_COLORS[metric.status]}`} style={{ width: `${metric.value}%` }} />
                    </div>
                    <div className="mt-2 flex gap-2 text-[10px] text-gray-400">
                      {['10s', '20s', '30s', '40s', '50s', '60s'].map((label) => (
                        <span key={label} className="rounded-full bg-gray-100 px-2 py-0.5">{label}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧩</span>
                <h2 className="text-xl font-bold text-amber-700">佈局工具</h2>
              </div>
              <div className="rounded-2xl border-2 border-amber-200 bg-white p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">編輯模式</span>
                  <button type="button" className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                    開啟
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <button type="button" className="rounded-lg border border-amber-200 px-3 py-2 text-amber-700">
                    旋轉
                  </button>
                  <button type="button" className="rounded-lg border border-amber-200 px-3 py-2 text-amber-700">
                    刪除
                  </button>
                  <button type="button" className="rounded-lg border border-amber-200 px-3 py-2 text-amber-700">
                    置頂
                  </button>
                  <button type="button" className="rounded-lg border border-amber-200 px-3 py-2 text-amber-700">
                    置底
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-amber-100 bg-white p-4 shadow-md">
                <div className="text-sm font-bold text-gray-700">Catalog</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                  {['desk', 'chair', 'meeting', 'rest', 'admin', 'deco'].map((item) => (
                    <span key={item} className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button type="button" className="rounded-lg bg-emerald-500 px-3 py-2 font-bold text-white">
                  Save
                </button>
                <button type="button" className="rounded-lg bg-blue-500 px-3 py-2 font-bold text-white">
                  Load
                </button>
                <button type="button" className="rounded-lg bg-rose-500 px-3 py-2 font-bold text-white">
                  Clear
                </button>
                <button type="button" className="rounded-lg bg-purple-500 px-3 py-2 font-bold text-white">
                  Export JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
