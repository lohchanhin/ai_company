export interface VPSConfig {
  id: string;
  name: string;
  hostname: string;
  ip: string;
  ssh: {
    port: number;
    user: string;
    keyPath?: string;
    password?: string;
  };
  role: 'web' | 'database' | 'api' | 'cache' | 'backup' | 'main' | 'staging';
  displayRole: 'programmer' | 'devops' | 'data-scientist' | 'qa-tester' | 'security' | 'ceo' | 'intern';
  gridX: number;
  gridY: number;
  thresholds?: {
    cpu?: { warning: number; critical: number };
    memory?: { warning: number; critical: number };
    disk?: { warning: number; critical: number };
  };
}

export interface VPSStatus {
  id: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
  metrics?: {
    cpu: number;
    memory: {
      used: number;
      total: number;
      percent: number;
    };
    disk: {
      used: number;
      total: number;
      percent: number;
    };
    uptime: number;
    load: {
      load1: number;
      load5: number;
      load15: number;
    };
  };
  lastUpdate: number;
  error?: string;
}

// 預設配置（可以被 vps-config.json 覆蓋）
export const DEFAULT_VPS_CONFIG: VPSConfig[] = [
  {
    id: 'vps-1',
    name: 'Current Server (localhost)',
    hostname: 'localhost',
    ip: '127.0.0.1',
    ssh: {
      port: 22,
      user: 'root',
      password: process.env.ROOT_PASSWORD || 'password'
    },
    role: 'web',
    displayRole: 'programmer',
    gridX: 3,
    gridY: 2,
    thresholds: {
      cpu: { warning: 70, critical: 90 },
      memory: { warning: 80, critical: 95 },
      disk: { warning: 80, critical: 90 }
    }
  }
];

// 角色映射
export const ROLE_SPRITE_MAP: Record<VPSConfig['role'], VPSConfig['displayRole']> = {
  'web': 'programmer',
  'api': 'devops',
  'database': 'data-scientist',
  'cache': 'qa-tester',
  'backup': 'security',
  'main': 'ceo',
  'staging': 'intern'
};

// 狀態判定
export function determineStatus(
  metrics: VPSStatus['metrics'],
  thresholds: VPSConfig['thresholds']
): 'online' | 'warning' | 'critical' {
  if (!metrics || !thresholds) return 'online';

  const { cpu, memory, disk } = metrics;
  const cpuThreshold = thresholds.cpu || { warning: 70, critical: 90 };
  const memThreshold = thresholds.memory || { warning: 80, critical: 95 };
  const diskThreshold = thresholds.disk || { warning: 80, critical: 90 };

  // Critical 條件
  if (
    cpu >= cpuThreshold.critical ||
    memory.percent >= memThreshold.critical ||
    disk.percent >= diskThreshold.critical
  ) {
    return 'critical';
  }

  // Warning 條件
  if (
    cpu >= cpuThreshold.warning ||
    memory.percent >= memThreshold.warning ||
    disk.percent >= diskThreshold.warning
  ) {
    return 'warning';
  }

  return 'online';
}
