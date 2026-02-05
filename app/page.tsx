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
  normal: 'bg-emerald-500',
  warn: 'bg-amber-500',
  crit: 'bg-rose-500',
};

const ui = {
  page: 'min-h-screen bg-slate-100 text-slate-900',
  header: 'border-b border-slate-200 bg-white',
  headerInner: 'flex items-center gap-4 px-8 py-5',
  h1: 'text-2xl font-semibold text-slate-900',
  h2: 'text-lg font-semibold text-slate-900',
  body: 'text-sm text-slate-600',
  label: 'text-xs font-medium text-slate-500',
  layout: 'flex h-[calc(100vh-88px)]',
  canvasCard: 'relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
  panel: 'w-[30%] border-l border-slate-200 bg-slate-50/80',
  panelHeader: 'sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 backdrop-blur',
  tabList: 'flex gap-6 px-4',
  tab: 'relative px-1 pb-3 pt-3 text-sm font-medium text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200',
  tabActive: 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-600',
  section: 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
  card: 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
  cardSubtle: 'rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm',
  badge: 'rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600',
  badgePrimary: 'rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600',
  buttonPrimary:
    'inline-flex items-center justify-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200',
  buttonSecondary:
    'inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200',
  buttonGhost:
    'inline-flex items-center justify-center rounded-full border border-transparent px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200',
  input:
    'rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200',
  progressTrack: 'h-2 w-full overflow-hidden rounded-full bg-slate-200',
  progressBar: 'h-full rounded-full bg-indigo-500',
};

const PRIORITY_BADGE: Record<string, string> = {
  high: 'bg-rose-50 text-rose-600',
  medium: 'bg-amber-50 text-amber-600',
  low: 'bg-emerald-50 text-emerald-600',
};

const STATUS_BADGE: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-indigo-50 text-indigo-600',
  blocked: 'bg-rose-50 text-rose-600',
  done: 'bg-emerald-50 text-emerald-600',
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
    <div className={ui.page}>
      <header className={ui.header}>
        <div className={ui.headerInner}>
          <span className="text-3xl">🏢</span>
          <div>
            <h1 className={ui.h1}>VPS 管理中心</h1>
            <p className={ui.body}>開羅風格可視化管理工具</p>
          </div>
        </div>
      </header>

      <div className={ui.layout}>
        {/* 左側：等距辦公室 Canvas (固定 70%) */}
        <div className="w-[70%] p-6">
          <div className={ui.canvasCard}>
            <VPSOfficeCanvas />
          </div>
        </div>
        
        {/* 右側：任務 / 人員 / 資源 / 佈局面板 */}
        <div className={`${ui.panel} overflow-y-auto`}>
          <div className={ui.panelHeader}>
            <div className={ui.tabList}>
              {[
                { id: 'tasks', label: 'Tasks' },
                { id: 'people', label: 'People' },
                { id: 'resources', label: 'Resources' },
                { id: 'layout', label: 'Layout' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`${ui.tab} ${activeTab === tab.id ? ui.tabActive : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'tasks' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <h2 className={ui.h2}>任務清單</h2>
                <span className={`ml-auto ${ui.badgePrimary}`}>
                  {groupedTasks.in_progress.length} 進行中
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  className={ui.input}
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
                  className={ui.input}
                  value={filters.priority}
                  onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}
                >
                  <option value="all">全部優先級</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
                <input
                  className={ui.input}
                  placeholder="指派者"
                  value={filters.assignee}
                  onChange={(event) => setFilters((prev) => ({ ...prev, assignee: event.target.value }))}
                />
                <input
                  className={ui.input}
                  placeholder="主管"
                  value={filters.manager}
                  onChange={(event) => setFilters((prev) => ({ ...prev, manager: event.target.value }))}
                />
                <input
                  className={`col-span-2 ${ui.input}`}
                  placeholder="關鍵字"
                  value={filters.keyword}
                  onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                />
              </div>

              {(['todo', 'in_progress', 'blocked', 'done'] as TaskStatus[]).map((status) => (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700">{STATUS_LABELS[status]}</h3>
                    <span className={ui.label}>{groupedTasks[status].length} 項</span>
                  </div>
                  {groupedTasks[status].map((task) => (
                    <div key={task.id} className={ui.card}>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-800">{task.title}</div>
                        <span className={ui.label}>{task.updatedAt}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                        <span className={ui.badge}>{task.assignee}</span>
                        <span className={ui.badge}>{task.manager}</span>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${PRIORITY_BADGE[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_BADGE[task.status]}`}>
                          {STATUS_LABELS[task.status]}
                        </span>
                      </div>
                      <div className={`mt-3 ${ui.progressTrack}`}>
                        <div className={ui.progressBar} style={{ width: `${task.progress}%` }} />
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
                <span className="text-2xl">🧑‍💻</span>
                <h2 className={ui.h2}>人員列表</h2>
                <button type="button" className={`ml-auto ${ui.buttonPrimary}`}>
                  新增員工
                </button>
              </div>
              <div className="space-y-3">
                {MOCK_PEOPLE.map((person) => (
                  <div key={person.id} className={ui.card}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-800">{person.name}</div>
                      <span className={ui.label}>{person.status}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-600">角色：{person.role}</div>
                    <div className="mt-1 text-xs text-slate-600">主管：{person.manager}</div>
                    <div className="mt-1 text-xs text-slate-500">Node：{person.nodeRef}</div>
                    <div className="mt-3 flex gap-2 text-xs">
                      <button type="button" className={ui.buttonSecondary}>
                        綁定座位
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                      >
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
                <span className="text-2xl">📊</span>
                <h2 className={ui.h2}>資源監控</h2>
              </div>
              <div className={ui.section}>
                <div className="text-sm font-semibold text-slate-700">VM 規格</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>vCPU：{MOCK_VM_SPEC.vCPU}</div>
                  <div>RAM：{MOCK_VM_SPEC.ramGB}GB</div>
                  <div>Disk：{MOCK_VM_SPEC.diskGB}GB</div>
                  <div>Net：{MOCK_VM_SPEC.netMbps}Mbps</div>
                </div>
              </div>
              <div className="space-y-3">
                {MOCK_METRICS.map((metric) => (
                  <div key={metric.label} className={ui.cardSubtle}>
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span>{metric.label}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className={`mt-2 ${ui.progressTrack}`}>
                      <div className={`h-full rounded-full ${METRIC_COLORS[metric.status]}`} style={{ width: `${metric.value}%` }} />
                    </div>
                    <div className="mt-2 flex gap-2 text-[10px] text-slate-400">
                      {['10s', '20s', '30s', '40s', '50s', '60s'].map((label) => (
                        <span key={label} className="rounded-full bg-slate-100 px-2 py-0.5">
                          {label}
                        </span>
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
                <span className="text-2xl">🧩</span>
                <h2 className={ui.h2}>佈局工具</h2>
              </div>
              <div className={ui.section}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">編輯模式</span>
                  <button type="button" className={ui.buttonPrimary}>
                    開啟
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <button type="button" className={ui.buttonSecondary}>
                    旋轉
                  </button>
                  <button type="button" className={ui.buttonSecondary}>
                    刪除
                  </button>
                  <button type="button" className={ui.buttonSecondary}>
                    置頂
                  </button>
                  <button type="button" className={ui.buttonSecondary}>
                    置底
                  </button>
                </div>
              </div>
              <div className={ui.section}>
                <div className="text-sm font-semibold text-slate-700">Catalog</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                  {['desk', 'chair', 'meeting', 'rest', 'admin', 'deco'].map((item) => (
                    <span key={item} className={ui.badge}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button type="button" className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200">
                  Save
                </button>
                <button type="button" className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200">
                  Load
                </button>
                <button type="button" className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200">
                  Clear
                </button>
                <button type="button" className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200">
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
