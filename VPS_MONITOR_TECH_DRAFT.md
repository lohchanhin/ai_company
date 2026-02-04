# VPS 監控整合技術方案草稿

**日期**: 2026-02-04  
**狀態**: 等待老闆確認

---

## 技術架構

### 1. 後端監控服務（Node.js）

#### SSH 連線模組
```typescript
// lib/vps-monitor/ssh-client.ts
import { Client } from 'ssh2';

export class SSHClient {
  private client: Client;
  
  async connect(config: SSHConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Client();
      this.client.on('ready', resolve);
      this.client.on('error', reject);
      this.client.connect({
        host: config.ip,
        port: config.port,
        username: config.user,
        privateKey: fs.readFileSync(config.keyPath)
      });
    });
  }
  
  async exec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.exec(command, (err, stream) => {
        if (err) reject(err);
        let output = '';
        stream.on('data', (data: Buffer) => {
          output += data.toString();
        });
        stream.on('close', () => resolve(output));
      });
    });
  }
}
```

#### 系統資源讀取
```typescript
// lib/vps-monitor/metrics.ts
export class MetricsCollector {
  async getCPU(ssh: SSHClient): Promise<number> {
    const output = await ssh.exec(
      "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'"
    );
    return parseFloat(output);
  }
  
  async getMemory(ssh: SSHClient): Promise<{ used: number; total: number }> {
    const output = await ssh.exec("free -m | grep Mem");
    const [_, total, used] = output.split(/\s+/);
    return {
      used: parseInt(used),
      total: parseInt(total)
    };
  }
  
  async getDisk(ssh: SSHClient): Promise<number> {
    const output = await ssh.exec("df -h / | tail -1 | awk '{print $5}' | sed 's/%//'");
    return parseInt(output);
  }
  
  async getUptime(ssh: SSHClient): Promise<number> {
    const output = await ssh.exec("cat /proc/uptime | awk '{print $1}'");
    return parseFloat(output);
  }
}
```

#### Docker 監控（可選）
```typescript
// lib/vps-monitor/docker.ts
export class DockerMonitor {
  async listContainers(ssh: SSHClient): Promise<Container[]> {
    const output = await ssh.exec(
      "docker ps --format '{{.Names}}|{{.Status}}|{{.CPUPerc}}|{{.MemPerc}}'"
    );
    return output.split('\n').map(line => {
      const [name, status, cpu, mem] = line.split('|');
      return {
        name,
        status,
        cpu: parseFloat(cpu),
        memory: parseFloat(mem)
      };
    });
  }
}
```

### 2. API 路由（Next.js App Router）

```typescript
// app/api/vps/[id]/metrics/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const vps = await getVPSConfig(params.id);
  const ssh = new SSHClient();
  
  try {
    await ssh.connect(vps.ssh);
    const collector = new MetricsCollector();
    
    const metrics = {
      cpu: await collector.getCPU(ssh),
      memory: await collector.getMemory(ssh),
      disk: await collector.getDisk(ssh),
      uptime: await collector.getUptime(ssh)
    };
    
    return Response.json({ success: true, metrics });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    ssh.disconnect();
  }
}
```

### 3. WebSocket 實時推送

```typescript
// app/api/vps/stream/route.ts
import { WebSocketServer } from 'ws';

export function GET(request: Request) {
  const wss = new WebSocketServer({ noServer: true });
  
  wss.on('connection', (ws) => {
    const interval = setInterval(async () => {
      const allVPS = await getAllVPS();
      const metrics = await Promise.all(
        allVPS.map(vps => collectMetrics(vps))
      );
      ws.send(JSON.stringify({ type: 'metrics', data: metrics }));
    }, 5000); // 每 5 秒更新
    
    ws.on('close', () => clearInterval(interval));
  });
  
  return new Response(null, { status: 101 });
}
```

### 4. 前端整合

```typescript
// hooks/useVPSMetrics.ts
export function useVPSMetrics() {
  const [metrics, setMetrics] = useState<VPSMetrics[]>([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3100/api/vps/stream');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'metrics') {
        setMetrics(data.data);
      }
    };
    
    return () => ws.close();
  }, []);
  
  return metrics;
}
```

```typescript
// components/IsometricCanvas/EmployeeSprite.tsx
function EmployeeSprite({ vps, metrics }: Props) {
  // 根據 CPU 計算顏色
  const color = useMemo(() => {
    if (!metrics || metrics.status === 'offline') return 'gray';
    if (metrics.cpu > 90) return 'red';
    if (metrics.cpu > 70) return 'yellow';
    return 'blue';
  }, [metrics]);
  
  // 根據 CPU 計算動畫速度
  const animationSpeed = useMemo(() => {
    if (!metrics) return 0;
    return metrics.cpu / 100;
  }, [metrics]);
  
  return (
    <Sprite
      texture={getTexture(vps.displayRole, color)}
      position={gridToIso(vps.gridX, vps.gridY)}
      animation={{ speed: animationSpeed }}
      onClick={() => onVPSClick(vps.id)}
    />
  );
}
```

---

## VPS 配置格式

```json
// vps-config.json
[
  {
    "id": "vps-1",
    "name": "Web Production",
    "hostname": "web-prod-1",
    "ip": "143.198.202.94",
    "ssh": {
      "port": 22,
      "user": "root",
      "keyPath": "~/.ssh/id_rsa"
    },
    "role": "web",
    "displayRole": "programmer",
    "gridX": 1,
    "gridY": 1,
    "thresholds": {
      "cpu": { "warning": 70, "critical": 90 },
      "memory": { "warning": 80, "critical": 95 },
      "disk": { "warning": 80, "critical": 90 }
    }
  },
  {
    "id": "vps-2",
    "name": "Database",
    "hostname": "db-prod-1",
    "ip": "167.99.123.45",
    "ssh": {
      "port": 22,
      "user": "root",
      "keyPath": "~/.ssh/id_rsa"
    },
    "role": "database",
    "displayRole": "data-scientist",
    "gridX": 3,
    "gridY": 1,
    "thresholds": {
      "cpu": { "warning": 70, "critical": 90 },
      "memory": { "warning": 80, "critical": 95 },
      "disk": { "warning": 80, "critical": 90 }
    }
  }
]
```

---

## 視覺映射規則

### 角色選擇
```typescript
const ROLE_SPRITE_MAP = {
  'web': 'programmer',
  'api': 'devops',
  'database': 'data-scientist',
  'cache': 'qa-tester',
  'backup': 'security',
  'main': 'ceo',
  'staging': 'intern'
};
```

### 狀態顏色
```typescript
function getStatusColor(metrics: Metrics) {
  if (!metrics) return '#95A5A6'; // 灰色（離線）
  if (metrics.cpu > 90) return '#E74C3C'; // 紅色（危險）
  if (metrics.cpu > 70) return '#F39C12'; // 黃色（警告）
  return '#3498DB'; // 藍色（正常）
}
```

### 動畫速度
```typescript
function getAnimationSpeed(cpu: number) {
  if (cpu < 30) return 0.3; // 慢速
  if (cpu < 60) return 0.6; // 正常
  if (cpu < 80) return 1.0; // 快速
  return 1.5; // 瘋狂
}
```

---

## 告警系統

### 桌面通知
```typescript
function sendDesktopNotification(vps: VPS, issue: string) {
  if (Notification.permission === 'granted') {
    new Notification(`⚠️ ${vps.name}`, {
      body: issue,
      icon: '/alert-icon.png'
    });
  }
}
```

### WhatsApp 通知（整合 OpenClaw）
```typescript
async function sendWhatsAppAlert(vps: VPS, issue: string) {
  await fetch('/api/notify', {
    method: 'POST',
    body: JSON.stringify({
      channel: 'whatsapp',
      message: `🚨 VPS Alert\n\n${vps.name} (${vps.ip})\n${issue}`
    })
  });
}
```

---

## 依賴套件

```json
{
  "dependencies": {
    "ssh2": "^1.15.0",
    "ws": "^8.16.0",
    "@types/ssh2": "^1.15.0",
    "@types/ws": "^8.5.10"
  }
}
```

---

## 安全考量

1. **SSH Key 管理**
   - 使用環境變數儲存 key 路徑
   - 不要提交 private key 到 Git

2. **API 認證**
   - 加入 JWT token 驗證
   - 限制 API 調用頻率

3. **錯誤處理**
   - SSH 連線失敗重試 3 次
   - 超時設定 10 秒
   - 記錄錯誤日誌

---

## 實作時程

### Phase 1: 基礎設施（40-50 分鐘）
- [ ] 安裝 ssh2 套件
- [ ] 實作 SSHClient 類別
- [ ] 實作 MetricsCollector
- [ ] 創建 API 路由
- [ ] 測試 SSH 連線

### Phase 2: 視覺整合（30-40 分鐘）
- [ ] 修改 EmployeeSprite 支援動態顏色
- [ ] 整合 useVPSMetrics hook
- [ ] 實作動畫速度控制
- [ ] 測試實時更新

### Phase 3: 互動與告警（30-40 分鐘）
- [ ] 點擊顯示詳情面板
- [ ] 實作告警邏輯
- [ ] 桌面通知
- [ ] WhatsApp 整合（可選）

---

**待老闆確認後立即開工！** 🚀
