import { SSHClient } from './ssh-client';

export interface SystemMetrics {
  cpu: number;        // 百分比 0-100
  memory: {
    used: number;     // MB
    total: number;    // MB
    percent: number;  // 百分比 0-100
  };
  disk: {
    used: number;     // GB
    total: number;    // GB
    percent: number;  // 百分比 0-100
  };
  uptime: number;     // 秒
  load: {
    load1: number;
    load5: number;
    load15: number;
  };
}

export class MetricsCollector {
  /**
   * 獲取 CPU 使用率
   */
  async getCPU(ssh: SSHClient): Promise<number> {
    try {
      const output = await ssh.exec(
        "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'"
      );
      const cpu = parseFloat(output);
      return isNaN(cpu) ? 0 : Math.min(100, Math.max(0, cpu));
    } catch (error) {
      console.error('Failed to get CPU:', error);
      return 0;
    }
  }

  /**
   * 獲取記憶體使用情況
   */
  async getMemory(ssh: SSHClient): Promise<SystemMetrics['memory']> {
    try {
      const output = await ssh.exec("free -m | grep Mem");
      const parts = output.split(/\s+/);
      const total = parseInt(parts[1]) || 0;
      const used = parseInt(parts[2]) || 0;
      const percent = total > 0 ? (used / total) * 100 : 0;

      return {
        total,
        used,
        percent: Math.min(100, Math.max(0, percent))
      };
    } catch (error) {
      console.error('Failed to get memory:', error);
      return { total: 0, used: 0, percent: 0 };
    }
  }

  /**
   * 獲取磁碟使用情況
   */
  async getDisk(ssh: SSHClient): Promise<SystemMetrics['disk']> {
    try {
      const output = await ssh.exec("df -BG / | tail -1");
      const parts = output.split(/\s+/);
      const total = parseInt(parts[1]) || 0;
      const used = parseInt(parts[2]) || 0;
      const percent = parseInt(parts[4]) || 0;

      return {
        total,
        used,
        percent: Math.min(100, Math.max(0, percent))
      };
    } catch (error) {
      console.error('Failed to get disk:', error);
      return { total: 0, used: 0, percent: 0 };
    }
  }

  /**
   * 獲取系統運行時間（秒）
   */
  async getUptime(ssh: SSHClient): Promise<number> {
    try {
      const output = await ssh.exec("cat /proc/uptime | awk '{print $1}'");
      const uptime = parseFloat(output);
      return isNaN(uptime) ? 0 : uptime;
    } catch (error) {
      console.error('Failed to get uptime:', error);
      return 0;
    }
  }

  /**
   * 獲取系統負載
   */
  async getLoad(ssh: SSHClient): Promise<SystemMetrics['load']> {
    try {
      const output = await ssh.exec("cat /proc/loadavg");
      const parts = output.split(/\s+/);
      return {
        load1: parseFloat(parts[0]) || 0,
        load5: parseFloat(parts[1]) || 0,
        load15: parseFloat(parts[2]) || 0
      };
    } catch (error) {
      console.error('Failed to get load:', error);
      return { load1: 0, load5: 0, load15: 0 };
    }
  }

  /**
   * 獲取所有系統指標
   */
  async getAllMetrics(ssh: SSHClient): Promise<SystemMetrics> {
    const [cpu, memory, disk, uptime, load] = await Promise.all([
      this.getCPU(ssh),
      this.getMemory(ssh),
      this.getDisk(ssh),
      this.getUptime(ssh),
      this.getLoad(ssh)
    ]);

    return { cpu, memory, disk, uptime, load };
  }
}
