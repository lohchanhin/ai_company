import { SSHClient } from './ssh-client';
import { MetricsCollector } from './metrics';
import { VPSConfig, VPSStatus, determineStatus } from './types';

export class VPSMonitor {
  private clients: Map<string, SSHClient> = new Map();
  private collector: MetricsCollector;
  private statusCache: Map<string, VPSStatus> = new Map();

  constructor() {
    this.collector = new MetricsCollector();
  }

  /**
   * 連線到 VPS
   */
  async connect(vps: VPSConfig): Promise<void> {
    const client = new SSHClient();
    await client.connect({
      host: vps.ip,
      port: vps.ssh.port,
      username: vps.ssh.user,
      privateKeyPath: vps.ssh.keyPath,
      password: vps.ssh.password
    });
    this.clients.set(vps.id, client);
  }

  /**
   * 斷開 VPS 連線
   */
  disconnect(vpsId: string): void {
    const client = this.clients.get(vpsId);
    if (client) {
      client.disconnect();
      this.clients.delete(vpsId);
    }
  }

  /**
   * 斷開所有連線
   */
  disconnectAll(): void {
    for (const [id, client] of this.clients.entries()) {
      client.disconnect();
    }
    this.clients.clear();
  }

  /**
   * 獲取 VPS 狀態
   */
  async getStatus(vps: VPSConfig): Promise<VPSStatus> {
    let client = this.clients.get(vps.id);

    try {
      // 如果未連線，嘗試連線
      if (!client || !client.isConnected()) {
        await this.connect(vps);
        client = this.clients.get(vps.id);
      }

      if (!client) {
        throw new Error('Failed to connect');
      }

      // 獲取系統指標
      const metrics = await this.collector.getAllMetrics(client);

      // 判定狀態
      const status = determineStatus(metrics, vps.thresholds);

      const vpsStatus: VPSStatus = {
        id: vps.id,
        status,
        metrics,
        lastUpdate: Date.now()
      };

      // 更新快取
      this.statusCache.set(vps.id, vpsStatus);

      return vpsStatus;
    } catch (error) {
      console.error(`Failed to get status for ${vps.id}:`, error);

      // 斷開連線
      this.disconnect(vps.id);

      const vpsStatus: VPSStatus = {
        id: vps.id,
        status: 'offline',
        lastUpdate: Date.now(),
        error: error instanceof Error ? error.message : String(error)
      };

      this.statusCache.set(vps.id, vpsStatus);

      return vpsStatus;
    }
  }

  /**
   * 批量獲取多個 VPS 狀態
   */
  async getMultipleStatus(vpsList: VPSConfig[]): Promise<VPSStatus[]> {
    return Promise.all(vpsList.map(vps => this.getStatus(vps)));
  }

  /**
   * 獲取快取的狀態
   */
  getCachedStatus(vpsId: string): VPSStatus | undefined {
    return this.statusCache.get(vpsId);
  }

  /**
   * 執行自訂命令
   */
  async executeCommand(vpsId: string, command: string): Promise<string> {
    const client = this.clients.get(vpsId);
    if (!client || !client.isConnected()) {
      throw new Error(`VPS ${vpsId} not connected`);
    }
    return client.exec(command);
  }
}

// 單例模式
let monitorInstance: VPSMonitor | null = null;

export function getMonitorInstance(): VPSMonitor {
  if (!monitorInstance) {
    monitorInstance = new VPSMonitor();
  }
  return monitorInstance;
}
