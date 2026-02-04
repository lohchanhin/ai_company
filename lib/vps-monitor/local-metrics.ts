import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SystemMetrics {
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
}

export class LocalMetricsCollector {
  async getCPU(): Promise<number> {
    try {
      const { stdout } = await execAsync(
        "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'"
      );
      const cpu = parseFloat(stdout);
      return isNaN(cpu) ? 0 : Math.min(100, Math.max(0, cpu));
    } catch (error) {
      return 0;
    }
  }

  async getMemory(): Promise<SystemMetrics['memory']> {
    try {
      const { stdout } = await execAsync("free -m | grep Mem");
      const parts = stdout.split(/\s+/);
      const total = parseInt(parts[1]) || 0;
      const used = parseInt(parts[2]) || 0;
      const percent = total > 0 ? (used / total) * 100 : 0;

      return {
        total,
        used,
        percent: Math.min(100, Math.max(0, percent))
      };
    } catch (error) {
      return { total: 0, used: 0, percent: 0 };
    }
  }

  async getDisk(): Promise<SystemMetrics['disk']> {
    try {
      const { stdout } = await execAsync("df -BG / | tail -1");
      const parts = stdout.split(/\s+/);
      const total = parseInt(parts[1]) || 0;
      const used = parseInt(parts[2]) || 0;
      const percent = parseInt(parts[4]) || 0;

      return {
        total,
        used,
        percent: Math.min(100, Math.max(0, percent))
      };
    } catch (error) {
      return { total: 0, used: 0, percent: 0 };
    }
  }

  async getUptime(): Promise<number> {
    try {
      const { stdout } = await execAsync("cat /proc/uptime | awk '{print $1}'");
      const uptime = parseFloat(stdout);
      return isNaN(uptime) ? 0 : uptime;
    } catch (error) {
      return 0;
    }
  }

  async getLoad(): Promise<SystemMetrics['load']> {
    try {
      const { stdout } = await execAsync("cat /proc/loadavg");
      const parts = stdout.split(/\s+/);
      return {
        load1: parseFloat(parts[0]) || 0,
        load5: parseFloat(parts[1]) || 0,
        load15: parseFloat(parts[2]) || 0
      };
    } catch (error) {
      return { load1: 0, load5: 0, load15: 0 };
    }
  }

  async getAllMetrics(): Promise<SystemMetrics> {
    const [cpu, memory, disk, uptime, load] = await Promise.all([
      this.getCPU(),
      this.getMemory(),
      this.getDisk(),
      this.getUptime(),
      this.getLoad()
    ]);

    return { cpu, memory, disk, uptime, load };
  }
}
