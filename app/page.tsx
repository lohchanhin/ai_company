'use client';

import { useMemo, useState } from 'react';
import { VPSOfficeCanvas } from '@/components/IsometricCanvas/VPSOfficeCanvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  page: 'min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]',
  header: 'border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]',
  headerInner: 'flex items-center gap-[var(--space-4)] px-[var(--space-8)] py-[var(--space-5)]',
  h1: 'text-2xl font-semibold text-[hsl(var(--foreground))]',
  h2: 'text-lg font-semibold text-[hsl(var(--foreground))]',
  body: 'text-sm text-[hsl(var(--muted-foreground))]',
  label: 'text-xs font-medium text-[hsl(var(--muted-foreground))]',
  layout: 'flex h-[calc(100vh-88px)]',
  canvasCard:
    'relative h-full overflow-hidden rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm',
  panel: 'w-[30%] border-l border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.6)]',
  panelHeader:
    'sticky top-0 z-10 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.9)] backdrop-blur',
  badge: 'rounded-full bg-[hsl(var(--muted))] px-2 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))]',
  badgePrimary:
    'rounded-full bg-[hsl(var(--accent))] px-2 py-1 text-xs font-medium text-[hsl(var(--accent-foreground))]',
  select:
    'h-9 w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-xs text-[hsl(var(--foreground))] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]',
  progressTrack: 'h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]',
  progressBar: 'h-full rounded-full bg-[hsl(var(--primary))]',
};

const PRIORITY_BADGE: Record<string, string> = {
  high: 'bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))]',
  medium: 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]',
  low: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]',
};

const STATUS_BADGE: Record<TaskStatus, string> = {
  todo: 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
  in_progress: 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]',
  blocked: 'bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))]',
  done: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]',
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
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          className="flex h-full flex-col"
        >
          <div className={ui.panelHeader}>
            <TabsList className="mx-4 my-3">
              {[
                { id: 'tasks', label: 'Tasks' },
                { id: 'people', label: 'People' },
                { id: 'resources', label: 'Resources' },
                { id: 'layout', label: 'Layout' },
              ].map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="min-w-[88px]">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="tasks" className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <h2 className={ui.h2}>任務清單</h2>
                <span className={`ml-auto ${ui.badgePrimary}`}>
                  {groupedTasks.in_progress.length} 進行中
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  className={ui.select}
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
                  className={ui.select}
                  value={filters.priority}
                  onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}
                >
                  <option value="all">全部優先級</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
                <Input
                  placeholder="指派者"
                  value={filters.assignee}
                  onChange={(event) => setFilters((prev) => ({ ...prev, assignee: event.target.value }))}
                />
                <Input
                  placeholder="主管"
                  value={filters.manager}
                  onChange={(event) => setFilters((prev) => ({ ...prev, manager: event.target.value }))}
                />
                <Input
                  className="col-span-2"
                  placeholder="關鍵字"
                  value={filters.keyword}
                  onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                />
              </div>

              {(['todo', 'in_progress', 'blocked', 'done'] as TaskStatus[]).map((status) => (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{STATUS_LABELS[status]}</h3>
                    <span className={ui.label}>{groupedTasks[status].length} 項</span>
                  </div>
                  {groupedTasks[status].map((task) => (
                    <Card key={task.id}>
                      <CardContent className="space-y-3 pt-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-[hsl(var(--foreground))]">{task.title}</div>
                          <span className={ui.label}>{task.updatedAt}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                          <span className={ui.badge}>{task.assignee}</span>
                          <span className={ui.badge}>{task.manager}</span>
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${PRIORITY_BADGE[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_BADGE[task.status]}`}>
                            {STATUS_LABELS[task.status]}
                          </span>
                        </div>
                        <div className={ui.progressTrack}>
                          <div className={ui.progressBar} style={{ width: `${task.progress}%` }} />
                        </div>
                        {task.status === 'blocked' && task.blockedReason && (
                          <div className="text-xs text-[hsl(var(--destructive))]">原因：{task.blockedReason}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
          </TabsContent>

          <TabsContent value="people" className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧑‍💻</span>
              <h2 className={ui.h2}>人員列表</h2>
              <Button size="sm" className="ml-auto">
                新增員工
              </Button>
            </div>
            <div className="space-y-3">
              {MOCK_PEOPLE.map((person) => (
                <Card key={person.id}>
                  <CardContent className="space-y-2 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-[hsl(var(--foreground))]">{person.name}</div>
                      <span className={ui.label}>{person.status}</span>
                    </div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">角色：{person.role}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">主管：{person.manager}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">Node：{person.nodeRef}</div>
                    <div className="flex gap-2 text-xs">
                      <Button variant="secondary" size="sm">
                        綁定座位
                      </Button>
                      <Button variant="destructive" size="sm">
                        移除
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <h2 className={ui.h2}>資源監控</h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>VM 規格</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                <div>vCPU：{MOCK_VM_SPEC.vCPU}</div>
                <div>RAM：{MOCK_VM_SPEC.ramGB}GB</div>
                <div>Disk：{MOCK_VM_SPEC.diskGB}GB</div>
                <div>Net：{MOCK_VM_SPEC.netMbps}Mbps</div>
              </CardContent>
            </Card>
            <div className="space-y-3">
              {MOCK_METRICS.map((metric) => (
                <Card key={metric.label} className="bg-[hsl(var(--muted)/0.6)]">
                  <CardContent className="space-y-2 pt-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-[hsl(var(--foreground))]">
                      <span>{metric.label}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className={ui.progressTrack}>
                      <div className={`h-full rounded-full ${METRIC_COLORS[metric.status]}`} style={{ width: `${metric.value}%` }} />
                    </div>
                    <div className="flex gap-2 text-[10px] text-[hsl(var(--muted-foreground))]">
                      {['10s', '20s', '30s', '40s', '50s', '60s'].map((label) => (
                        <span key={label} className="rounded-full bg-[hsl(var(--background))] px-2 py-0.5">
                          {label}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧩</span>
              <h2 className={ui.h2}>佈局工具</h2>
            </div>
            <Card>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[hsl(var(--foreground))]">編輯模式</span>
                  <Button size="sm">開啟</Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Button variant="secondary" size="sm">
                    旋轉
                  </Button>
                  <Button variant="secondary" size="sm">
                    刪除
                  </Button>
                  <Button variant="secondary" size="sm">
                    置頂
                  </Button>
                  <Button variant="secondary" size="sm">
                    置底
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Catalog</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                {['desk', 'chair', 'meeting', 'rest', 'admin', 'deco'].map((item) => (
                  <span key={item} className={ui.badge}>
                    {item}
                  </span>
                ))}
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button size="sm">Save</Button>
              <Button size="sm" variant="secondary">
                Load
              </Button>
              <Button size="sm" variant="destructive">
                Clear
              </Button>
              <Button size="sm" variant="outline">
                Export JSON
              </Button>
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
